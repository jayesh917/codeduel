import { MatchEngine } from '../match/MatchEngine';
import { Server, Socket } from 'socket.io';
import { GameStateInstance } from './GameState';
import { MatchStatus } from './GameStateTypes';

export class CoreGameStateManager {
  private static io: Server;
  private static matches = new Map<string, GameStateInstance>();
  private static socketToUser = new Map<string, { roomId: string; userId: string }>();
  private static disconnectTimeouts = new Map<string, NodeJS.Timeout>();
  
  static initialize(io: Server) {
    this.io = io;
    this.startCleanupJob();
  }

  private static startCleanupJob() {
    setInterval(() => {
      const now = Date.now();
      for (const [roomId, match] of this.matches.entries()) {
        const isOld = now - match.state.createdAt > 30 * 60 * 1000;
        const isFinished = match.state.matchStatus === MatchStatus.MATCH_FINISHED || match.state.matchStatus === MatchStatus.CANCELLED;
        const isFinishedOld = isFinished && (now - (match.state.roundState.endTime || match.state.createdAt) > 5 * 60 * 1000);
        
        // Find if all disconnected
        let allDisconnected = true;
        for (const player of match.state.players.values()) {
          if (player.status !== 'DISCONNECTED') {
            allDisconnected = false;
            break;
          }
        }
        
        if ((isOld && allDisconnected) || isFinishedOld) {
          this.destroyMatch(roomId);
        }
      }
    }, 60 * 1000);
  }

  static createMatch(roomId: string, hostId: string, bestOf: number, language: string, hostName: string, hostSocketId: string): GameStateInstance {
    const match = new GameStateInstance(this.io, roomId, hostId, bestOf, language, hostName, hostSocketId);
    console.log(`[GameStateManager] Room Created: ${roomId}`);
    this.matches.set(roomId, match);
    this.socketToUser.set(hostSocketId, { roomId, userId: hostId });
    return match;
  }

  static getMatch(roomId: string): GameStateInstance | undefined {
    return this.matches.get(roomId);
  }

  static joinMatch(socket: Socket, roomId: string, userId: string, name: string): { error?: string, match?: GameStateInstance } {
    const match = this.getMatch(roomId);
    if (!match) return { error: 'Match not found or has expired.' };
    
    // Check if player already exists
    if (match.state.players.has(userId)) {
      // Clear timeout if reconnecting
      const timeout = this.disconnectTimeouts.get(userId);
      if (timeout) {
        clearTimeout(timeout);
        this.disconnectTimeouts.delete(userId);
      }
      match.reconnectPlayer(userId, socket.id);
      this.socketToUser.set(socket.id, { roomId, userId });
      return { match };
    }

    if (match.state.players.size >= 2) {
      return { error: 'Match is already full.' };
    }

    match.addPlayer(userId, socket.id, name, false);
    this.socketToUser.set(socket.id, { roomId, userId });
    
    if (match.state.players.size === 2) {
      match.startMatch();
    }
    
    return { match };
  }

  static reconnectPlayer(socket: Socket, roomId: string, userId: string): { error?: string, match?: GameStateInstance } {
    const match = this.getMatch(roomId);
    if (!match) return { error: 'Match not found.' };
    
    if (!match.state.players.has(userId)) return { error: 'Player not found in match.' };
    
    const timeout = this.disconnectTimeouts.get(userId);
    if (timeout) {
      clearTimeout(timeout);
      this.disconnectTimeouts.delete(userId);
    }
    
    match.reconnectPlayer(userId, socket.id);
    this.socketToUser.set(socket.id, { roomId, userId });
    
    return { match };
  }

  static handleDisconnect(socketId: string) {
    const session = this.socketToUser.get(socketId);
    if (!session) return;
    
    this.socketToUser.delete(socketId);
    const { roomId, userId } = session;
    console.log(`[GameStateManager] Player Disconnected: ${userId} left ${roomId}`);
    
    const match = this.getMatch(roomId);
    if (!match) return;

    match.removePlayer(userId);

    const timeout = setTimeout(() => {
      const currentMatch = this.getMatch(roomId);
      if (currentMatch && currentMatch.state.matchStatus === MatchStatus.ROUND_ACTIVE) {
        // check if everyone else answered or disconnected

        
        MatchEngine.handleDisconnectTimeout(currentMatch, userId);
      }
      this.disconnectTimeouts.delete(userId);
    }, 15000); // 15 seconds reconnect window

    this.disconnectTimeouts.set(userId, timeout);
  }

  static destroyMatch(roomId: string) {
    const match = this.getMatch(roomId);
    if (match) {
      match.destroyMatch();
      this.matches.delete(roomId);
      console.log(`[GameStateManager] Room Destroyed: ${roomId}`);
    }
  }
}

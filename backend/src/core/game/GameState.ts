import { MatchEngine } from '../match/MatchEngine';
import { Server } from 'socket.io';
import { GameState, MatchStatus, PlayerStatus } from './GameStateTypes';
import { Room } from '../../../../shared/types';

export class GameStateInstance {
  public state: GameState;
  public io: Server;
  
  // For backward compatibility mapping
  public legacyRoom: Room;
  
  constructor(io: Server, roomId: string, hostId: string, bestOf: number, language: string, hostName: string, hostSocketId: string) {
    this.io = io;
    
    this.state = {
      roomId,
      hostId,
      players: new Map(),
      matchStatus: MatchStatus.WAITING,
      difficulty: 'Easy', // default
      language,
      
      questionState: {
        questionIndex: 0,
        questionsUsed: new Set(),
        questionsRemaining: []
      },
      
      roundState: {
        currentRound: 0,
        totalRounds: bestOf,
      },
      
      timerState: {
        duration: 0,
        timeLeft: 0,
        isRunning: false
      },
      
      createdAt: Date.now(),
      
      answers: {},
      submitTimes: {}
    };

    // Initialize legacy room
    this.legacyRoom = {
      id: roomId,
      bestOf,
      language,
      players: [],
      status: 'waiting',
      createdAt: this.state.createdAt
    };

    this.addPlayer(hostId, hostSocketId, hostName, true);
  }

  public getRoomId(): string {
    return this.state.roomId;
  }

  public addPlayer(userId: string, socketId: string, name: string, isHost: boolean = false) {
    if (!this.state.players.has(userId)) {
      this.state.players.set(userId, {
        userId,
        socketId,
        name,
        isHost,
        status: PlayerStatus.CONNECTED,
        stats: {
          score: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          skipped: 0,
          perfectRounds: 0,
          averageResponseTime: 0,
          totalResponseTime: 0
        }
      });
      this.syncLegacyRoom();
      // removed player-status
    }
  }

  public reconnectPlayer(userId: string, socketId: string) {
    const player = this.state.players.get(userId);
    if (player) {
      player.socketId = socketId;
      if (player.status === PlayerStatus.DISCONNECTED) {
        player.status = this.state.matchStatus === MatchStatus.ROUND_ACTIVE ? PlayerStatus.THINKING : PlayerStatus.CONNECTED;
      }
      this.syncLegacyRoom();
      // removed player-status
      MatchEngine.handlePlayerReconnect(this);
    }
  }

  public removePlayer(userId: string) {
    const player = this.state.players.get(userId);
    if (player) {
      player.status = PlayerStatus.DISCONNECTED;
      this.syncLegacyRoom();
      // removed player-status
      MatchEngine.handlePlayerDisconnect(this);
    }
  }

  public startMatch() {
    MatchEngine.startMatchCountdown(this);
  }

  public startRound() {
    MatchEngine.startRound(this);
  }

  public submitAnswer(userId: string, answer: string | string[]) {
    MatchEngine.receiveAnswer(this, userId, answer);
  }

  public finishRound() {
    MatchEngine.evaluateRound(this);
  }

  public finishMatch() {
    MatchEngine.finishMatch(this);
  }

  public destroyMatch() {
    MatchEngine.destroyMatch(this);
  }

  public startTimer(duration: number) {
    MatchEngine.startServerTimer(this, duration);
  }

  public stopTimer() {
    if (this.state.timerState.intervalId) {
      clearInterval(this.state.timerState.intervalId);
      this.state.timerState.intervalId = undefined;
    }
    this.state.timerState.isRunning = false;
  }

  public syncLegacyRoom() {
    // Map new state to legacy Room interface
    const legacyPlayers = Array.from(this.state.players.values()).map(p => {
      let legacyStatus: 'Waiting' | 'Thinking' | 'Answered' | 'Disconnected' = 'Waiting';
      if (p.status === 'THINKING') legacyStatus = 'Thinking';
      else if (p.status === 'ANSWERED') legacyStatus = 'Answered';
      else if (p.status === 'DISCONNECTED') legacyStatus = 'Disconnected';
      
      return {
        userId: p.userId,
        socketId: p.socketId,
        name: p.name,
        isHost: p.isHost,
        connected: p.status !== 'DISCONNECTED',
        status: legacyStatus,
        score: p.stats.score
      };
    });
    this.legacyRoom.players = legacyPlayers;
    
    if (this.legacyRoom.matchState) {
      this.legacyRoom.matchState.answers = this.state.answers;
      this.legacyRoom.matchState.submitTimes = this.state.submitTimes;
      this.legacyRoom.matchState.firstCorrectUserId = this.state.firstCorrectUserId;
    }
    // removed state-update
    
    // Always emit room-updated for frontend backward compatibility
    this.io.to(this.state.roomId).emit('room-updated', this.legacyRoom);
  }

  public broadcast(event: string, payload: unknown) {
    this.io.to(this.state.roomId).emit(event, payload);
  }
}

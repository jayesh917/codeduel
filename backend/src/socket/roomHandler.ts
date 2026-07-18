import { Server, Socket } from 'socket.io';
import { CoreGameStateManager } from '../core/game/GameStateManager';
import { ROOM_CODE_LENGTH } from '../constants';
import { validatePlayerName, validateRoomCode, validateLanguage, validateBestOf, validateAnswer } from '../utils/validation';

export function setupRoomHandlers(io: Server, socket: Socket) {
  const rateLimit = { count: 0, resetAt: Date.now() + 10000 };

  socket.use((packet, next) => {
    const now = Date.now();
    if (now > rateLimit.resetAt) {
      rateLimit.count = 0;
      rateLimit.resetAt = now + 10000;
    }
    rateLimit.count++;
    if (rateLimit.count > 20) {
      console.warn(`[Socket Security] Rate limit exceeded for socket ${socket.id}`);
      return next(new Error('Rate limit exceeded'));
    }
    next();
  });

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  socket.on('create-room', async ({ userId, name, bestOf, language }, callback) => {
    if (!callback) return;
    try {
      if (typeof userId !== 'string' || userId.length > 50) {
        return callback({ error: 'Invalid User ID.' });
      }
      
      const cleanName = validatePlayerName(name);
      if (!cleanName) {
        return callback({ error: 'Invalid name. Must be 2-20 characters long.' });
      }

      const cleanLang = validateLanguage(language) || 'Python';
      const cleanBestOf = validateBestOf(bestOf) || 3;
      
      let roomId = generateRoomCode();
      let attempts = 0;
      while (CoreGameStateManager.getMatch(roomId) && attempts < 10) {
        roomId = generateRoomCode();
        attempts++;
      }
      
      await socket.join(roomId);
      const match = CoreGameStateManager.createMatch(roomId, userId, cleanBestOf, cleanLang, cleanName, socket.id);
      console.log(`[GameStateManager] Room Created: ${roomId} by ${cleanName}`);
      
      callback({ success: true, room: match.legacyRoom });
    } catch (error: any) {
      console.error('[Socket Error] Failed to create room:', error);
      callback({
        error: error.message
      });
    }
  });

  socket.on('join-room', async ({ userId, name, roomId }, callback) => {
    if (!callback) return;
    if (typeof userId !== 'string' || userId.length > 50) return callback({ error: 'Invalid User ID.' });
    if (!validateRoomCode(roomId)) return callback({ error: 'Invalid Room Code.' });

    const cleanName = validatePlayerName(name);
    if (!cleanName) return callback({ error: 'Invalid name. Must be 2-20 characters long.' });

    const matchObj = CoreGameStateManager.getMatch(roomId);
    if (matchObj) {
        // Prevent duplicate names
        for (const p of matchObj.state.players.values()) {
            if (p.name.toLowerCase() === cleanName.toLowerCase() && p.userId !== userId) {
                return callback({ error: 'Name already taken in this room.' });
            }
        }
    }
    
    await socket.join(roomId);
    const result = CoreGameStateManager.joinMatch(socket, roomId, userId, cleanName);
    if (result.error) {
      socket.leave(roomId);
      return callback({ error: result.error });
    }
    
    console.log(`[GameStateManager] Player Joined: ${cleanName} joined ${roomId}`);
    callback({ success: true, room: result.match?.legacyRoom });
  });

  socket.on('reconnect-room', async ({ userId, roomId }, callback) => {
    if (!callback) return;
    if (typeof userId !== 'string' || !validateRoomCode(roomId)) return callback({ error: 'Invalid data.' });

    await socket.join(roomId);
    const result = CoreGameStateManager.reconnectPlayer(socket, roomId, userId);
    if (result.error) {
      socket.leave(roomId);
      return callback({ error: result.error });
    }
    
    callback({ success: true, room: result.match?.legacyRoom });
  });
  
  socket.on('submit-answer', ({ roomId, userId, answer }) => {
    if (typeof userId !== 'string' || !validateRoomCode(roomId)) return;
    if (!validateAnswer(answer)) return;

    const match = CoreGameStateManager.getMatch(roomId);
    if (match) {
      match.submitAnswer(userId, answer);
    }
  });

  socket.on('disconnect', () => {
    CoreGameStateManager.handleDisconnect(socket.id);
  });
}


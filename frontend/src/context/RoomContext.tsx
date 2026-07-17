import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo } from 'react';
import { socket } from '../sockets/socket';
import { Room } from '../../../shared/types';
import { getUserId } from '../utils/userId';

interface RoomContextType {
  room: Room | null;
  error: string | null;

  createRoom: (name: string, bestOf: number, language: string) => Promise<string>;
  joinRoom: (name: string, roomId: string) => Promise<string>;
  submitAnswer: (answer: string | string[]) => void;
  clearError: () => void;
}

interface SocketResponse {
  success?: boolean;
  room?: Room;
  error?: string;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);
const TimerContext = createContext<number | null>(null);

export function RoomProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    const handleRoomUpdated = (updatedRoom: Room) => {
      setRoom(updatedRoom);
      if (updatedRoom.matchState) {
        setTimeLeft(updatedRoom.matchState.timeLeft);
      }
      if (updatedRoom.status === 'finished') {
        sessionStorage.removeItem('codeDuelRoomId');
      } else {
        sessionStorage.setItem('codeDuelRoomId', updatedRoom.id);
      }
    };

    const handleTimerTick = (time: number) => {
      setTimeLeft(time);
    };

    const handleConnect = () => {
      const currentRoom = roomRef.current;
      const storedRoomId = sessionStorage.getItem('codeDuelRoomId');
      const roomIdToReconnect = currentRoom?.id || storedRoomId;

      if (roomIdToReconnect) {
        socket.emit('reconnect-room', { userId: getUserId(), roomId: roomIdToReconnect }, (response: SocketResponse) => {
          if (response.error) {
             setError(response.error);
             setRoom(null);
             sessionStorage.removeItem('codeDuelRoomId');
          } else if (response.room) {
             setRoom(response.room);
             if (response.room.status === 'finished') {
               sessionStorage.removeItem('codeDuelRoomId');
             } else {
               sessionStorage.setItem('codeDuelRoomId', response.room.id);
             }
          }
        });
      }
    };

    socket.on('room-updated', handleRoomUpdated);
    socket.on('timer-tick', handleTimerTick);
    socket.on('connect', handleConnect);

    // If socket is already connected on mount, trigger connection handler immediately
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      socket.off('timer-tick', handleTimerTick);
      socket.off('connect', handleConnect);
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const createRoom = useCallback((name: string, bestOf: number, language: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      socket.emit('create-room', { userId: getUserId(), name, bestOf, language }, (response: SocketResponse) => {
        if (response.error) {
          setError(response.error);
          reject(response.error);
        } else if (response.room) {
          setRoom(response.room);
          sessionStorage.setItem('codeDuelRoomId', response.room.id);
          resolve(response.room.id);
        }
      });
    });
  }, []);

  const joinRoom = useCallback((name: string, roomId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      socket.emit('join-room', { userId: getUserId(), name, roomId }, (response: SocketResponse) => {
        if (response.error) {
          setError(response.error);
          reject(response.error);
        } else if (response.room) {
          setRoom(response.room);
          sessionStorage.setItem('codeDuelRoomId', response.room.id);
          resolve(response.room.id);
        }
      });
    });
  }, []);

  const submitAnswer = useCallback((answer: string | string[]) => {
    if (roomRef.current) {
      socket.emit('submit-answer', { roomId: roomRef.current.id, userId: getUserId(), answer });
    }
  }, []);

  const value = useMemo(() => ({
    room,
    error,
    createRoom,
    joinRoom,
    submitAnswer,
    clearError
  }), [room, error, createRoom, joinRoom, submitAnswer, clearError]);

  return (
    <TimerContext.Provider value={timeLeft}>
      <RoomContext.Provider value={value}>
        {children}
      </RoomContext.Provider>
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

const fs = require('fs');

let content = fs.readFileSync('frontend/src/context/RoomContext.tsx', 'utf8');

content = content.replace("import { createContext, useContext, useEffect, useState, ReactNode } from 'react';", "import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';");

const oldUseEffect = `  useEffect(() => {
    const handleRoomUpdated = (updatedRoom: Room) => {
      setRoom(updatedRoom);
      if (updatedRoom.matchState) {
        setTimeLeft(updatedRoom.matchState.timeLeft);
      }
    };

    const handleTimerTick = (time: number) => {
      setTimeLeft(time);
    };

    socket.on('room-updated', handleRoomUpdated);
    socket.on('timer-tick', handleTimerTick);

    const handleConnect = () => {
      if (room) {
        socket.emit('reconnect-room', { userId: getUserId(), roomId: room.id }, (response: SocketResponse) => {
          if (response.error) {
             setError(response.error);
             setRoom(null);
          } else if (response.room) {
             setRoom(response.room);
          }
        });
      }
    };

    socket.on('connect', handleConnect);

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      socket.off('timer-tick', handleTimerTick);
      socket.off('connect', handleConnect);
    };
  }, [room]);`;

const newUseEffect = `  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    const handleRoomUpdated = (updatedRoom: Room) => {
      setRoom(updatedRoom);
      if (updatedRoom.matchState) {
        setTimeLeft(updatedRoom.matchState.timeLeft);
      }
    };

    const handleTimerTick = (time: number) => {
      setTimeLeft(time);
    };

    const handleConnect = () => {
      const currentRoom = roomRef.current;
      if (currentRoom) {
        socket.emit('reconnect-room', { userId: getUserId(), roomId: currentRoom.id }, (response: SocketResponse) => {
          if (response.error) {
             setError(response.error);
             setRoom(null);
          } else if (response.room) {
             setRoom(response.room);
          }
        });
      }
    };

    socket.on('room-updated', handleRoomUpdated);
    socket.on('timer-tick', handleTimerTick);
    socket.on('connect', handleConnect);

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      socket.off('timer-tick', handleTimerTick);
      socket.off('connect', handleConnect);
    };
  }, []);`;

content = content.replace(oldUseEffect, newUseEffect);
fs.writeFileSync('frontend/src/context/RoomContext.tsx', content);

import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL || window.location.origin;

export const socket = io(URL, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});
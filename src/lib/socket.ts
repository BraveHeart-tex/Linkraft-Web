import { io, Socket } from 'socket.io-client';
import { Nullable } from './common.types';

let socket: Nullable<Socket> = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL!}/bookmarks`, {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }

  return socket;
};

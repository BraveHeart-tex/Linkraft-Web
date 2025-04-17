import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL!}/bookmarks`, {
      withCredentials: true,
      transports: ['websocket'],
    });
  }

  return socket;
};

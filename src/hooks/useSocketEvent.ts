import { SocketEvent, SocketEventPayloads } from '@/lib/ws/socket.types';
import { useEffect } from 'react';
import { useSocketClient } from './useSocketClient';

export const useSocketEvent = <K extends SocketEvent>(
  event: K,
  handler: (payload: SocketEventPayloads[K]) => void
) => {
  const socket = useSocketClient();

  useEffect(() => {
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
};

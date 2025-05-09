import { getSocketClient } from '@/lib/ws/socket';
import { useEffect, useMemo } from 'react';

export const useSocketClient = () => {
  const socketClient = useMemo(() => getSocketClient(), []);

  useEffect(() => {
    socketClient.connect();
  }, [socketClient]);

  return socketClient;
};

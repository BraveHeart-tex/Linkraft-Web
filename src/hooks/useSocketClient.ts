import { getSocketClient } from '@/lib/ws/socket';
import { useEffect, useMemo } from 'react';

export const useSocketClient = () => {
  const socketClient = useMemo(() => getSocketClient(), []);

  useEffect(() => {
    const socketClient = getSocketClient();
    socketClient.connect();

    const handleUnload = () => {
      socketClient.disconnect();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return socketClient;
};

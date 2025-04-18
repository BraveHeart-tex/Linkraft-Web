'use client';
import { getSocket } from '@/lib/socket';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

const SocketContext = createContext<ReturnType<typeof getSocket> | null>(null);

// FIXME: Check for getSocket calls
// so we don't make unnecessary connections
const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket] = useState(getSocket());

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;

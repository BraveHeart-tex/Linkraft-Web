'use client';
import { getSocket } from '@/lib/socket';
import { Nullable } from '@/lib/common.types';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Nullable<Socket>>(null);

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

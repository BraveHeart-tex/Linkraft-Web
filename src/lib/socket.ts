import { io, Socket } from 'socket.io-client';
import { Nullable } from './common.types';
import { Bookmark } from '@/features/bookmarks/bookmark.types';

let socket: Nullable<Socket> = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(
      `${process.env.NEXT_PUBLIC_API_URL!}/${SOCKET_NAMESPACES.BOOKMARKS}`,
      {
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      }
    );
  }

  return socket;
};

export const SOCKET_EVENTS = {
  BOOKMARK: {
    SUBSCRIBE: 'bookmark:subscribe',
    UNSUBSCRIBE: 'bookmark:unsubscribe',
    UPDATE: 'bookmark:update',
  },
  IMPORT: {
    SUBSCRIBE: 'import:subscribe',
    UNSUBSCRIBE: 'import:unsubscribe',
    PROGRESS: 'import:progress',
    COMPLETE: 'import:complete',
    ERROR: 'import:error',
  },
};

export const SOCKET_NAMESPACES = {
  BOOKMARKS: 'bookmarks',
};

export const SOCKET_ROOMS = {
  bookmark: (bookmarkId: Bookmark['id']) => `bookmark:${bookmarkId}`,
  importJob: (jobId: string) => `import:${jobId}`,
};

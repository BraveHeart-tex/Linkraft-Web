import { useSocket } from '@/context/SocketProvider';
import { SOCKET_EVENTS } from '@/lib/socket';
import {
  BookmarkImportStatus,
  useBookmarkImportStore,
} from '@/lib/stores/bookmark-import/useBookmarkImportStore';
import { useEffect } from 'react';

interface BookmarkImportSocketProgress {
  importJobId: string;
  progress: number;
  status: BookmarkImportStatus;
}

export const useBookmarkImportSocketProgress = () => {
  const importJobId = useBookmarkImportStore((state) => state.importJobId);
  const setProgress = useBookmarkImportStore((state) => state.setProgress);
  const reset = useBookmarkImportStore((state) => state.reset);
  const socket = useSocket();

  useEffect(() => {
    if (!importJobId) return;
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.IMPORT.SUBSCRIBE, {
      importJobId,
    });

    const handleProgress = (data: BookmarkImportSocketProgress) => {
      if (data.importJobId !== importJobId) return;

      setProgress(data.progress, data.status);

      if (data.status === 'completed' || data.status === 'failed') {
        setTimeout(() => {
          reset();
          socket.emit(SOCKET_EVENTS.IMPORT.UNSUBSCRIBE, {
            importJobId,
          });
        }, 2000);
      }
    };

    socket.on(SOCKET_EVENTS.IMPORT.PROGRESS, handleProgress);

    return () => {
      socket.emit(SOCKET_EVENTS.IMPORT.UNSUBSCRIBE, {
        importJobId,
      });
      socket.off(SOCKET_EVENTS.IMPORT.PROGRESS, handleProgress);
    };
  }, [importJobId, reset, setProgress, socket]);
};

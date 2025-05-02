import { useSocket } from '@/context/SocketProvider';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { SOCKET_EVENTS } from '@/lib/socket';
import {
  BookmarkImportStatus,
  useImportBookmarkStore,
} from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface BookmarkImportSocketProgress {
  importJobId: string;
  progress: number;
  status: BookmarkImportStatus;
}

export const useBookmarkImportSocketProgress = () => {
  const importJobId = useImportBookmarkStore((state) => state.importJobId);
  const setProgress = useImportBookmarkStore((state) => state.setProgress);
  const reset = useImportBookmarkStore((state) => state.reset);
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!importJobId) return;
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.IMPORT.SUBSCRIBE, {
      importJobId,
    });

    const handleProgress = async (data: BookmarkImportSocketProgress) => {
      if (data.importJobId !== importJobId) return;

      setProgress(data.progress, data.status);

      if (data.status === 'completed' || data.status === 'failed') {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.bookmarks.list(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.dashboard.generalStats(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.collections.list(),
          }),
        ]);
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

import { useSocketClient } from '@/hooks/useSocketClient';
import { QUERY_KEYS } from '@/lib/queryKeys';
import {
  BookmarkImportStatus,
  useImportBookmarkStore,
} from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useBookmarkImportSocketProgress = () => {
  const importJobId = useImportBookmarkStore((state) => state.importJobId);
  const setProgress = useImportBookmarkStore((state) => state.setProgress);
  const reset = useImportBookmarkStore((state) => state.reset);
  const queryClient = useQueryClient();
  const socket = useSocketClient();

  useEffect(() => {
    if (!importJobId || !socket) return;

    const handleProgress = async (data: {
      importJobId: string;
      progress: number;
      status: BookmarkImportStatus;
    }) => {
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
          socket.emit('import:unsubscribe', { importJobId });
        }, 2000);
      }
    };

    socket.emit('import:subscribe', { importJobId });
    socket.on('import:progress', handleProgress);

    return () => {
      socket.emit('import:unsubscribe', { importJobId });
      socket.off('import:progress', handleProgress);
    };
  }, [importJobId, setProgress, reset, queryClient, socket]);
};

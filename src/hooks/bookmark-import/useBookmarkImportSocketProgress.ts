import { useSocketClient } from '@/hooks/useSocketClient';
import { QUERY_KEYS } from '@/lib/queryKeys';
import {
  BookmarkImportStatus,
  useImportBookmarkStore,
} from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const IMPORT_BOOKMARK_RESET_WAIT_MS = 2000;

export const useBookmarkImportSocketProgress = () => {
  const importJobId = useImportBookmarkStore((state) => state.importJobId);
  const setProgress = useImportBookmarkStore((state) => state.setProgress);
  const reset = useImportBookmarkStore((state) => state.reset);
  const queryClient = useQueryClient();
  const socket = useSocketClient();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          reset();
          timeoutRef.current = null;
        }, IMPORT_BOOKMARK_RESET_WAIT_MS);
      }
    };

    socket.on('import:progress', handleProgress);

    return () => {
      socket.off('import:progress', handleProgress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [importJobId, setProgress, reset, queryClient, socket]);
};

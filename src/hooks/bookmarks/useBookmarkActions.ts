import {
  usePermanentlyDeleteBookmark,
  useRestoreBookmark,
  useTrashBookmark,
} from '@/features/bookmarks/bookmark.api';
import { BOOKMARK_RESTORE_CONFIRM_THRESHOLD_MINUTES } from '@/features/bookmarks/bookmark.constants';
import type {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { Collection } from '@/features/collections/collection.types';
import { useOnSettledHandler } from '@/hooks/queryUtils/useOnSettledHandler';
import type { ErrorApiResponse } from '@/lib/api/api.types';
import { removeItemFromInfiniteQueryData } from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';

export const useBookmarkActions = (collectionId?: Collection['id']) => {
  const openModal = useModalStore((state) => state.openModal);
  const queryClient = useQueryClient();

  const trashOnSettled = useOnSettledHandler(
    [
      QUERY_KEYS.bookmarks.list(),
      QUERY_KEYS.bookmarks.trashed(),
      QUERY_KEYS.search.list(''),
      QUERY_KEYS.dashboard.generalStats(),
    ],
    {
      exact: false,
      forceExactKeys: collectionId
        ? [QUERY_KEYS.collections.listBookmarks(collectionId)]
        : undefined,
    }
  );

  const { mutate: trashBookmark } = useTrashBookmark({
    onMutate: async (variables) => {
      const toastId = showSuccessToast('Bookmark moved to trash successfully.');
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarks.list(),
      });

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list()
      );

      const previousCollectionBookmarks = collectionId
        ? queryClient.getQueryData<InfiniteBookmarksData>(
            QUERY_KEYS.collections.listBookmarks(collectionId)
          )
        : undefined;

      setQueryDataBatch<InfiniteBookmarksData>(
        queryClient,
        [
          QUERY_KEYS.bookmarks.list(),
          collectionId
            ? QUERY_KEYS.collections.listBookmarks(collectionId)
            : undefined,
        ],
        (old) =>
          removeItemFromInfiniteQueryData(
            old,
            (item) => item.id !== variables.bookmarkId
          )
      );

      return {
        previousBookmarks,
        previousCollectionBookmarks,
        toastId,
      };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.bookmarks.list(),
        context?.previousBookmarks
      );
      if (collectionId) {
        queryClient.setQueryData(
          QUERY_KEYS.collections.listBookmarks(collectionId),
          context?.previousCollectionBookmarks
        );
      }
      showErrorToast('An error occurred while moving bookmark to trash', {
        description: error.message,
        id: context?.toastId,
      });
    },
    onSettled: trashOnSettled,
  });

  const deleteOnSettled = useOnSettledHandler([QUERY_KEYS.bookmarks.trashed()]);
  const { mutate: permanentlyDeleteBookmark } = usePermanentlyDeleteBookmark({
    onMutate: async (variables) => {
      const toastId = showSuccessToast('Bookmark deleted successfully.');
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.bookmarks.trashed(),
      });

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.trashed()
      );

      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.trashed(),
        (old) =>
          removeItemFromInfiniteQueryData(
            old,
            (item) => item.id !== variables.bookmarkId
          )
      );

      return {
        previousBookmarks,
        toastId,
      };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.trashed(),
        context?.previousBookmarks
      );
      showErrorToast('An error occurred while deleting the bookmark', {
        description: error.message,
        id: context?.toastId,
      });
    },
    onSettled: deleteOnSettled,
  });

  const { mutate: restoreBookmark, isPending: isRestoringBookmark } =
    useRestoreBookmark({
      async onMutate(variables) {
        const toastId = showSuccessToast('Bookmark restored successfully.');

        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
        });

        const previousTrashedBookmarks =
          queryClient.getQueryData<InfiniteBookmarksData>(
            QUERY_KEYS.bookmarks.trashed()
          );

        if (!previousTrashedBookmarks) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.trashed(),
          (oldData) =>
            removeItemFromInfiniteQueryData(
              oldData,
              (oldBookmark) => oldBookmark.id !== variables.bookmarkId
            )
        );

        return { previousTrashedBookmarks, toastId };
      },
      onError(error, _variables, context) {
        const apiError = error as ErrorApiResponse;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.trashed(),
          context?.previousTrashedBookmarks
        );

        showErrorToast(
          'An error occurred while restoring the bookmark from trash',
          {
            description: apiError.message,
            id: context?.toastId,
          }
        );
      },
      async onSettled() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.bookmarks.list(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.bookmarks.trashed(),
          }),
        ]);
      },
    });

  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );

  const handleCopyUrl = async (bookmark: Bookmark) => {
    try {
      await navigator.clipboard.writeText(bookmark.url);
      showSuccessToast('URL copied to clipboard');
    } catch {
      showErrorToast('Failed to copy URL to clipboard', {
        description: 'Please try again.',
      });
    }
  };

  const handleTrashBookmark = (bookmarkId: Bookmark['id']) => {
    showConfirmDialog({
      title: 'Move this bookmark to trash?',
      message: 'You can restore it from the trash at any time if needed.',
      alertText:
        'Bookmarks in the trash for more than 30 days will be permanently deleted.',
      onConfirm: () => {
        trashBookmark({
          bookmarkId,
        });
      },
      primaryActionLabel: 'Move to Trash',
    });
  };

  const handlePermanentBookmarkDeletion = (bookmark: Bookmark) => {
    if (!bookmark.deletedAt) return;

    showConfirmDialog({
      title: 'Are you sure you want to delete this bookmark?',
      message:
        'This action cannot be undone, and the bookmark will be permanently deleted.',
      alertText:
        'This bookmark will be lost forever. Are you sure you want to continue?',
      onConfirm: () => {
        permanentlyDeleteBookmark({
          bookmarkId: bookmark.id,
        });
      },
      primaryActionLabel: 'Yes, Delete Forever',
    });
  };

  const handleRestoreBookmark = (bookmark: Bookmark) => {
    if (!bookmark.deletedAt) return;

    const elapsedDurationMinutes = DateTime.now().diff(
      DateTime.fromISO(bookmark.deletedAt),
      'minutes'
    ).minutes;

    if (elapsedDurationMinutes < BOOKMARK_RESTORE_CONFIRM_THRESHOLD_MINUTES) {
      restoreBookmark({
        bookmarkId: bookmark.id,
      });
      return;
    }

    showConfirmDialog({
      title: 'Restore this bookmark?',
      message: 'This bookmark will be moved back to your active list.',
      alertText: 'It will no longer be in the trash.',
      onConfirm: () => {
        restoreBookmark({
          bookmarkId: bookmark.id,
        });
      },
      primaryActionLabel: 'Restore Bookmark',
    });
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    openModal({
      type: MODAL_TYPES.EDIT_BOOKMARK,
      payload: {
        bookmark,
      },
    });
  };

  return {
    handleCopyUrl,
    handleTrashBookmark,
    handlePermanentBookmarkDeletion,
    handleRestoreBookmark,
    handleEditBookmark,
    isRestoringBookmark,
  };
};

const setQueryDataBatch = <T>(
  client: QueryClient,
  keys: (readonly unknown[] | undefined)[],
  updater: (old: T | undefined) => T | undefined
) => {
  keys.forEach((key) => {
    if (key) {
      client.setQueryData<T>(key, updater);
    }
  });
};

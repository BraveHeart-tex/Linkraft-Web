'use client';
import {
  usePermanentlyDeleteBookmark,
  useRestoreBookmark,
  useTrashBookmark,
} from '@/features/bookmarks/bookmark.api';
import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import {
  ArchiveRestoreIcon,
  Copy,
  Edit,
  MoreVertical,
  PinIcon,
  Trash,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useConfirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { DateTime } from 'luxon';
import { useModalStore } from '@/lib/stores/modalStore';

interface BookmarkActionsProps {
  bookmark: Bookmark;
}

const BOOKMARK_RESTORE_CONFIRM_THRESHOLD_MINUTES = 60;

const BookmarkActions = ({ bookmark }: BookmarkActionsProps) => {
  const isTrashed = !!bookmark.deletedAt;
  const openModal = useModalStore((state) => state.openModal);
  const queryClient = useQueryClient();
  const { mutate: permanentlyDeleteBookmark } = usePermanentlyDeleteBookmark({
    async onMutate() {
      const toastId = showSuccessToast('Bookmark deleted successfully.');

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.bookmarks.getTrashedBookmarks],
      });

      const previousBookmarks = queryClient.getQueryData<Bookmark[]>([
        QUERY_KEYS.bookmarks.getTrashedBookmarks,
      ]);

      if (!previousBookmarks) return;

      queryClient.setQueryData<Bookmark[]>(
        [QUERY_KEYS.bookmarks.getTrashedBookmarks],
        (old) => old?.filter((oldBookmark) => oldBookmark.id !== bookmark.id)
      );

      return { previousBookmarks, toastId };
    },
    onError(error, _variables, context) {
      const apiError = error as ErrorApiResponse;

      queryClient.setQueryData(
        [QUERY_KEYS.bookmarks.getTrashedBookmarks],
        context?.previousBookmarks
      );

      showErrorToast('An error occurred while deleting the bookmark', {
        description: apiError.message,
        id: context?.toastId,
      });
    },
  });

  const { mutate: restoreBookmark, isPending: isRestoringBookmark } =
    useRestoreBookmark({
      async onMutate() {
        const toastId = showSuccessToast('Bookmark restored successfully.');

        await queryClient.cancelQueries({
          queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
        });

        const previousBookmarks = queryClient.getQueryData<Bookmark[]>([
          QUERY_KEYS.bookmarks.getBookmarks,
        ]);

        const previousTrashedBookmarks = queryClient.getQueryData<Bookmark[]>([
          QUERY_KEYS.bookmarks.getTrashedBookmarks,
        ]);

        if (!previousBookmarks || !previousTrashedBookmarks) return;

        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getBookmarks],
          (old) => [...(old || []), { ...bookmark, deletedAt: null }]
        );

        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getTrashedBookmarks],
          (old) => old?.filter((oldBookmark) => oldBookmark.id !== bookmark.id)
        );

        return { previousBookmarks, previousTrashedBookmarks, toastId };
      },
      onError(error, _variables, context) {
        const apiError = error as ErrorApiResponse;

        queryClient.setQueryData(
          [QUERY_KEYS.bookmarks.getBookmarks],
          context?.previousBookmarks
        );

        queryClient.setQueryData(
          [QUERY_KEYS.bookmarks.getTrashedBookmarks],
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
    });

  const { mutate: trashBookmark } = useTrashBookmark({
    async onMutate(variables) {
      const toastId = showSuccessToast('Bookmark moved to trash successfully.');

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
      });

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        [QUERY_KEYS.bookmarks.getBookmarks]
      );

      if (!previousBookmarks) return;

      queryClient.setQueryData<InfiniteBookmarksData>(
        [QUERY_KEYS.bookmarks.getBookmarks],
        (oldData) =>
          oldData
            ? {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                  ...page,
                  bookmarks: page.bookmarks.filter(
                    (oldBookmark) => oldBookmark.id !== variables.bookmarkId
                  ),
                })),
              }
            : undefined
      );

      return { previousBookmarks, toastId };
    },
    onError(error, _variables, context) {
      const apiError = error as ErrorApiResponse;

      queryClient.setQueryData(
        [QUERY_KEYS.bookmarks.getBookmarks],
        context?.previousBookmarks
      );

      showErrorToast('An error occurred while moving the bookmark to trash', {
        description: apiError.message,
        id: context?.toastId,
      });
    },
  });

  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(bookmark.url);
    showSuccessToast('URL copied to clipboard');
  };

  const handleTrashBookmark = () => {
    showConfirmDialog({
      title: 'Move this bookmark to trash?',
      message: 'You can restore it from the trash at any time if needed.',
      alertText:
        'Bookmarks in the trash for more than 30 days will be permanently deleted.',
      onConfirm: () => {
        trashBookmark({
          bookmarkId: bookmark.id,
        });
      },
      primaryActionLabel: 'Move to Trash',
    });
  };

  const handlePermanentBookmarkDeletion = () => {
    if (!isTrashed) return;

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

  const handleRestoreBookmark = () => {
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

  const handleEditBookmark = () => {
    openModal({
      type: 'edit-bookmark',
      payload: {
        bookmark,
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!isTrashed ? (
          <>
            <DropdownMenuItem onClick={handleEditBookmark}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PinIcon className="mr-2 h-4 w-4" />
              Pin
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={handleRestoreBookmark}
              disabled={isRestoringBookmark}
            >
              <ArchiveRestoreIcon className="mr-2 h-4 w-4" />
              Restore
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={
            isTrashed ? handlePermanentBookmarkDeletion : handleTrashBookmark
          }
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete {isTrashed ? 'Permanently' : ''}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkActions;

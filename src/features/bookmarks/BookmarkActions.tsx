'use client';
import { useDeleteBookmark } from '@/features/bookmarks/bookmark.api';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { Copy, Edit, MoreVertical, Star, Trash } from 'lucide-react';
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

export interface BookmarkActionsProps {
  bookmark: Bookmark;
}

const BookmarkActions = ({ bookmark }: BookmarkActionsProps) => {
  const queryClient = useQueryClient();
  const { mutate: deleteBookmark } = useDeleteBookmark({
    async onMutate() {
      showSuccessToast('Bookmark deleted successfully.');

      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
      });

      const previousBookmarks = queryClient.getQueryData<Bookmark[]>([
        QUERY_KEYS.bookmarks.getBookmarks,
      ]);

      if (!previousBookmarks) return;

      queryClient.setQueryData<Bookmark[]>(
        [QUERY_KEYS.bookmarks.getBookmarks],
        (old) => old?.filter((oldBookmark) => oldBookmark.id !== bookmark.id)
      );

      return { previousBookmarks };
    },
    onError(error, _variables, context) {
      const apiError = error as ErrorApiResponse;

      queryClient.setQueryData(
        [QUERY_KEYS.bookmarks.getBookmarks],
        context?.previousBookmarks
      );

      showErrorToast('An error occurred while deleting the bookmark', {
        description: apiError.message,
      });
    },
  });

  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(bookmark.url);
  };

  const handleDeleteBookmark = () => {
    showConfirmDialog({
      title: 'Move bookmark to trash?',
      message: 'You can restore it from the trash later if needed.',
      alertText:
        'Bookmarks in Trash for over 30 days will be automatically deleted',
      onConfirm: () => {
        deleteBookmark({
          bookmarkId: bookmark.id,
        });
      },
      primaryActionLabel: 'Move to Trash',
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
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyUrl}>
          <Copy className="mr-2 h-4 w-4" />
          Copy URL
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Star className="mr-2 h-4 w-4" />
          Add to favorites
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDeleteBookmark}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkActions;

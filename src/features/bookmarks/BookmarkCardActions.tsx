'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { useBookmarkActions } from '@/hooks/bookmarks/useBookmarkActions';
import {
  ArchiveRestoreIcon,
  Copy,
  Edit,
  MoreVertical,
  Trash,
} from 'lucide-react';

interface BookmarkActionsProps {
  bookmark: Bookmark;
}

const BookmarkActions = ({ bookmark }: BookmarkActionsProps) => {
  const {
    handleCopyUrl,
    handleEditBookmark,
    handlePermanentBookmarkDeletion,
    handleRestoreBookmark,
    handleTrashBookmark,
    isRestoringBookmark,
  } = useBookmarkActions(bookmark.collectionId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          aria-label="More options"
        >
          <MoreVertical className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent aria-label="More options" align="end">
        {bookmark.deletedAt ? (
          <>
            <DropdownMenuItem
              onClick={() => handleRestoreBookmark(bookmark)}
              disabled={isRestoringBookmark}
              aria-disabled={isRestoringBookmark}
            >
              <ArchiveRestoreIcon className="mr-2 size-4" />
              Restore
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleEditBookmark(bookmark)}>
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopyUrl(bookmark)}>
              <Copy className="mr-2 size-4" />
              Copy URL
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={
            bookmark.deletedAt
              ? () => handlePermanentBookmarkDeletion(bookmark)
              : () => handleTrashBookmark(bookmark.id)
          }
        >
          <Trash className="mr-2 size-4" />
          Delete {bookmark.deletedAt ? 'Permanently' : ''}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BookmarkActions;

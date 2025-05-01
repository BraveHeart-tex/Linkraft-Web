'use client';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
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
import { useBookmarkActions } from '@/hooks/bookmarks/useBookmarkActions';

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
  } = useBookmarkActions(bookmark);

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
      <DropdownMenuContent align="end">
        {bookmark.deletedAt ? (
          <>
            <DropdownMenuItem
              onClick={handleRestoreBookmark}
              disabled={isRestoringBookmark}
            >
              <ArchiveRestoreIcon className="mr-2 size-4" />
              Restore
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleEditBookmark}>
              <Edit className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="mr-2 size-4" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PinIcon className="mr-2 size-4" />
              Pin
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={
            bookmark.deletedAt
              ? handlePermanentBookmarkDeletion
              : handleTrashBookmark
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

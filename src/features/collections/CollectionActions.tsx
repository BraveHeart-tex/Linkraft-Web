'use client';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu';
import {
  ArrowRightLeftIcon,
  EditIcon,
  EllipsisIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';

interface CollectionActionsProps {
  onEdit: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onAddBookmark: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMoveBookmarks: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

const CollectionActions = ({
  onEdit,
  onDelete,
  onAddBookmark,
  onMoveBookmarks,
}: CollectionActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Collection actions">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="">
        <DropdownMenuItem onClick={onEdit}>
          <EditIcon className="mr-2 h-4 w-4" />
          Edit Info
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onAddBookmark}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Bookmark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMoveBookmarks}>
          <ArrowRightLeftIcon className="mr-2 h-4 w-4" />
          Move Bookmarks
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionActions;

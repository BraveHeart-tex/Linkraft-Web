'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';

const NewActionsDropdown = () => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isBookmarkFormDialogOpen, setIsBookmarkFormDialogOpen] =
    useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="px-1" size="sm">
            <div className="flex items-center justify-between gap-1">
              <Plus className="h-6! w-6!" />
              <ChevronDown className="h-2 w-4 ml-auto" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-max grid">
          <DropdownMenuItem
            className="justify-start"
            asChild
            onClick={() => setIsBookmarkFormDialogOpen(true)}
          >
            <Button variant="ghost">New Link</Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-start"
            asChild
            onClick={() => setIsCollectionDialogOpen(true)}
          >
            <Button variant="ghost">New Collection</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CollectionFormDialog
        isOpen={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      />
      <BookmarkFormDialog
        isOpen={isBookmarkFormDialogOpen}
        onOpenChange={setIsBookmarkFormDialogOpen}
      />
    </>
  );
};
export default NewActionsDropdown;

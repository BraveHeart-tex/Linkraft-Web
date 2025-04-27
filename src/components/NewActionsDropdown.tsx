'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  ChevronDown,
  FolderIcon,
  LinkIcon,
  Plus,
  UploadIcon,
} from 'lucide-react';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { useState } from 'react';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
import FileImportDialog from '@/features/import-bookmarks/FileImportDialog';

const NewActionsDropdown = () => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isBookmarkFormDialogOpen, setIsBookmarkFormDialogOpen] =
    useState(false);
  const [isFileImportDialogOpen, setIsFileImportDialogOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setIsFileImportDialogOpen(true)}>
            <UploadIcon />
            Import from Browser
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsBookmarkFormDialogOpen(true)}>
            <LinkIcon />
            New Bookmark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsCollectionDialogOpen(true)}>
            <FolderIcon />
            New Collection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FileImportDialog
        isOpen={isFileImportDialogOpen}
        onOpenChange={setIsFileImportDialogOpen}
      />
      <BookmarkFormDialog
        isOpen={isBookmarkFormDialogOpen}
        onOpenChange={setIsBookmarkFormDialogOpen}
      />
      <CollectionFormDialog
        isOpen={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      />
    </>
  );
};
export default NewActionsDropdown;

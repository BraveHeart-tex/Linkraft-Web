'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useState } from 'react';

const NewActionsDropdown = () => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-max grid">
          <DropdownMenuItem className="justify-start" asChild>
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
    </>
  );
};
export default NewActionsDropdown;

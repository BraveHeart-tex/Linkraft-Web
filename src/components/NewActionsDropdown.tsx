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

const NewActionsDropdown = () => {
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="px-1">
            <div className="flex items-center justify-between gap-1">
              <Plus className="h-6! w-6!" />
              <ChevronDown className="h-2 w-4 ml-auto" />
            </div>
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

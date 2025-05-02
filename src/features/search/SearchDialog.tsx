'use client';
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { useState } from 'react';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
  const [query, setQuery] = useState('');

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search bookmarks, tags, collections..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList></CommandList>
    </CommandDialog>
  );
};

export default SearchCommandDialog;

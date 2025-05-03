'use client';
import { CommandItem } from '@/components/ui/command';
import { SearchResult } from '@/features/search/search.types';
import { useMutationObserver } from '@/hooks/use-mutation-observer';
import { BookmarkIcon, FolderIcon, HashIcon, SearchIcon } from 'lucide-react';
import { useRef } from 'react';

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bookmark':
      return <BookmarkIcon className="mr-2" />;
    case 'collection':
      return <FolderIcon className="mr-2" />;
    case 'tag':
      return <HashIcon className="mr-2" />;
    default:
      return <SearchIcon className="mr-2" />;
  }
};

interface SearchDialogItemProps {
  result: SearchResult;
  onPeek?: (result: SearchResult) => void;
}

const SearchDialogItem = ({ result, onPeek }: SearchDialogItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected' &&
        ref.current?.getAttribute('aria-selected') === 'true'
      ) {
        onPeek?.(result);
      }
    });
  });

  return (
    <CommandItem ref={ref} className="flex items-center px-4 py-2">
      {getIconForType(result.type)}
      <span className="tracking-tight text-foreground line-clamp-1">
        {result.title}
      </span>
    </CommandItem>
  );
};

export default SearchDialogItem;

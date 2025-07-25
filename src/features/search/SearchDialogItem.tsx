'use client';
import { CommandItem } from '@/components/ui/Command';
import { SearchResult, SearchResultType } from '@/features/search/search.types';
import { useBookmarkShortcuts } from '@/hooks/search/useBookmarkShortcuts';
import { useMutationObserver } from '@/hooks/useMutationObserver';
import { BookmarkIcon, FolderIcon, SearchIcon } from 'lucide-react';
import { memo, useRef, useState } from 'react';

const getIconForType = (type: SearchResultType) => {
  switch (type.toLowerCase() as Lowercase<SearchResultType>) {
    case 'bookmark': {
      return <BookmarkIcon className="mr-2" />;
    }
    case 'collection': {
      return <FolderIcon className="mr-2" />;
    }
    default: {
      return <SearchIcon className="mr-2" />;
    }
  }
};

interface SearchDialogItemProps {
  result: SearchResult;
  onPeek?: (result: SearchResult) => void;
}

const SearchDialogItem = memo(({ result, onPeek }: SearchDialogItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'aria-selected'
      ) {
        const isSelected =
          ref.current?.getAttribute('aria-selected') === 'true';
        setIsActive(isSelected);

        if (isSelected) {
          onPeek?.(result);
        }
      }
    });
  });

  useBookmarkShortcuts({ enabled: isActive, peekingItem: result });

  return (
    <CommandItem ref={ref} className="flex items-center px-4 py-2 rounded-none">
      {getIconForType(result.type)}
      <span className="tracking-tight text-foreground line-clamp-1">
        {result.title}
      </span>
    </CommandItem>
  );
});

SearchDialogItem.displayName = 'SearchDialogItem';

export default SearchDialogItem;

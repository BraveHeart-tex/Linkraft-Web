'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import ActionShortcut from '@/features/search/ActionShortcut';
import { useSearch } from '@/features/search/search.api';
import { SearchResult } from '@/features/search/search.types';
import SearchDialogItem from '@/features/search/SearchDialogItem';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
  const [peekingItem, setPeekingItem] = useState<SearchResult | null>(null);
  const { ref, inView } = useInView();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isPending, fetchNextPage, isFetchingNextPage } = useSearch({
    query: debouncedQuery,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      commandProps={{ shouldFilter: false }}
      dialogContentClassName="flex flex-col w-full max-w-2xl sm:max-w-3xl max-h-[90vh]"
    >
      <div className="flex items-center border-b px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Search bookmarks, tags, collections..."
          value={query}
          onValueChange={setQuery}
          wrapperClassName="border-b-0 w-full"
          className="border-0 focus:ring-0 focus-visible:ring-0"
        />
      </div>

      <CommandList className="flex-1 overflow-y-auto w-full">
        {isPending ? (
          <div className="py-6 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p>Searching...</p>
            </div>
          </div>
        ) : (
          <>
            {data?.pages.length === 0 && !isPending ? (
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </div>
              </CommandEmpty>
            ) : null}
            <CommandGroup heading="Bookmarks">
              {data?.pages.map((page) => (
                <React.Fragment key={page.nextCursor}>
                  {page.results.map((result) => (
                    <SearchDialogItem
                      result={result}
                      key={`${result.id}-${result.type}`}
                      onPeek={setPeekingItem}
                    />
                  ))}
                </React.Fragment>
              ))}
              {isFetchingNextPage && (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                  <p>Loading more…</p>
                </div>
              )}
              <div ref={ref} className="h-1" />
            </CommandGroup>
          </>
        )}
      </CommandList>

      {peekingItem && (
        <footer className="border-t bg-popover px-4 py-3 hidden lg:block">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {peekingItem.type === 'bookmark' && (
              <>
                <ActionShortcut label="Open in new tab" keys={['⌘', '↵']} />
                <ActionShortcut label="Copy link" keys={['⌘', 'C']} />
                <ActionShortcut label="Edit" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
              </>
            )}
            {peekingItem.type === 'collection' && (
              <>
                <ActionShortcut label="Open collection" keys={['⌘', '↵']} />
                <ActionShortcut label="Rename" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
                <ActionShortcut label="Add bookmark" keys={['⌘', 'B']} />
              </>
            )}
          </div>
        </footer>
      )}
    </CommandDialog>
  );
};

export default SearchCommandDialog;

'use client';

import { CommandDialog, CommandInput } from '@/components/ui/Command';
import ActionShortcut from '@/features/search/ActionShortcut';
import { useSearch } from '@/features/search/search.api';
import { SearchResult } from '@/features/search/search.types';
import SearchResultsList from '@/features/search/SearchResultsList';
import { useBookmarkShortcuts } from '@/hooks/search/useBookmarkShortcuts';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_QUERY_DEBOUNCE_WAIT_MS = 300;

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
  const [peekingItem, setPeekingItem] = useState<SearchResult | null>(null);
  const { ref: sentinelRef, inView } = useInView();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_QUERY_DEBOUNCE_WAIT_MS);
  const { data, isPending, fetchNextPage, isFetchingNextPage } = useSearch({
    query: debouncedQuery,
  });
  useBookmarkShortcuts({ enabled: isOpen, peekingItem });

  const isEmpty = useMemo(() => {
    return data && data.pages.every((page) => page.results.length === 0);
  }, [data]);

  const allResults = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

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
        <CommandInput
          placeholder="Search bookmarks, tags, collections..."
          value={query}
          onValueChange={setQuery}
          wrapperClassName="border-b-0 w-full"
          className="border-0 focus:ring-0 focus-visible:ring-0"
        />
      </div>

      <SearchResultsList
        results={allResults}
        isEmpty={!!isEmpty}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        onItemPeek={setPeekingItem}
        sentinelRef={sentinelRef}
      />

      {peekingItem && (
        <footer className="border-t bg-popover px-4 py-3 hidden lg:block">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {peekingItem.type === 'bookmark' && (
              <>
                <ActionShortcut label="Open in new tab" keys={['⌘', '↵']} />
                <ActionShortcut label="Copy link" keys={['⌘', 'L']} />
                <ActionShortcut label="Edit" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
              </>
            )}
          </div>
        </footer>
      )}
    </CommandDialog>
  );
};

export default SearchCommandDialog;

'use client';

import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@/components/ui/Command';
import ActionShortcut from '@/features/search/ActionShortcut';
import { useSearch } from '@/features/search/search.api';
import { SearchResult } from '@/features/search/search.types';
import SearchDialogItem from '@/features/search/SearchDialogItem';
import { useBookmarkShortcuts } from '@/hooks/search/useBookmarkShortcuts';
import { useDebounce } from '@/hooks/useDebounce';
import { useVirtualizer } from '@tanstack/react-virtual';
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

  // Hack to make sure the virtualizer works with the CommandList
  const [parentRef, setParentRef] = useState(null as HTMLDivElement | null);

  const virtualizer = useVirtualizer({
    count: allResults.length,
    getScrollElement: () => parentRef,
    estimateSize: () => 44,
    overscan: 5,
    enabled: isOpen,
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
        <CommandInput
          placeholder="Search bookmarks, tags, collections..."
          value={query}
          onValueChange={setQuery}
          wrapperClassName="border-b-0 w-full"
          className="border-0 focus:ring-0 focus-visible:ring-0"
        />
      </div>

      <CommandList
        ref={setParentRef}
        className="flex-1 overflow-y-auto w-full max-h-[300px]"
      >
        {isPending ? (
          <div className="py-6 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p>Searching...</p>
            </div>
          </div>
        ) : (
          <>
            {isEmpty && !isPending ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No results found {query ? `for '${query}'` : ''}
              </div>
            ) : (
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const result = allResults[virtualRow.index];
                  return (
                    <article
                      key={result.id}
                      ref={
                        virtualRow.index === allResults.length - 1
                          ? sentinelRef
                          : null
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="border-b last:border-b-0"
                    >
                      <SearchDialogItem
                        result={result}
                        onPeek={setPeekingItem}
                      />
                    </article>
                  );
                })}
                {isFetchingNextPage && (
                  <div className="py-4 text-center text-sm text-muted-foreground absolute bottom-0 left-0 right-0">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
                    <p>Loading more…</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CommandList>

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

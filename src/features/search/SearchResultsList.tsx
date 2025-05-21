'use client';
import { SearchResult } from '@/features/search/search.types';
import SearchDialogItem from '@/features/search/SearchDialogItem';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CommandList } from 'cmdk';
import { memo, useRef } from 'react';

interface SearchResultsListProps {
  results: SearchResult[];
  isPending: boolean;
  isEmpty: boolean;
  sentinelRef: (node?: Element | null) => void;
  onItemPeek: (item: SearchResult) => void;
  isFetchingNextPage: boolean;
}

const SearchResultsList = memo(
  ({
    results,
    isPending,
    isEmpty,
    sentinelRef,
    onItemPeek,
    isFetchingNextPage,
  }: SearchResultsListProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
      count: results.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 44,
      overscan: 5,
    });

    return (
      <CommandList
        ref={parentRef}
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
                No results found
              </div>
            ) : (
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const result = results[virtualRow.index];
                  return (
                    <article
                      key={result.id}
                      ref={
                        virtualRow.index === results.length - 1
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
                      <SearchDialogItem result={result} onPeek={onItemPeek} />
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
    );
  }
);

SearchResultsList.displayName = 'SearchResultsList';

export default SearchResultsList;

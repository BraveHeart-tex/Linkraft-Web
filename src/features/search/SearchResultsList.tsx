'use client';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSearch } from '@/features/search/search.api';
import { SearchResult } from '@/features/search/search.types';
import SearchDialogItem from '@/features/search/SearchDialogItem';
import { useVirtualizer } from '@tanstack/react-virtual';
import { CommandList } from 'cmdk';
import { memo, useEffect, useRef } from 'react';

interface SearchResultsListProps {
  results: SearchResult[];
  isPending: boolean;
  onItemPeek: (item: SearchResult) => void;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: ReturnType<typeof useSearch>['fetchNextPage'];
}

const SearchResultsList = memo(
  ({
    results,
    isPending,
    onItemPeek,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  }: SearchResultsListProps) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
      count: results.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 44,
      overscan: 5,
    });

    const items = virtualizer.getVirtualItems();

    useEffect(() => {
      if (results.length === 0) return;

      const lastResult = items[items.length - 1];
      if (!lastResult) return;

      if (
        lastResult.index >= results.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }, [items, results, hasNextPage, fetchNextPage, isFetchingNextPage]);

    return (
      <CommandList
        ref={parentRef}
        className="flex-1 overflow-y-auto w-full max-h-[300px] h-[300px]"
      >
        {isPending ? (
          <div className="py-6 text-center text-sm h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner />
              <p>Searching...</p>
            </div>
          </div>
        ) : (
          <>
            {results.length === 0 && !isPending ? (
              <div className="py-6 text-center text-sm text-muted-foreground h-[300px] flex items-center justify-center">
                No results found
              </div>
            ) : (
              <>
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
                </div>
                {isFetchingNextPage ? (
                  <div className="py-4 w-full flex items-center justify-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <LoadingSpinner />
                      Loading More...
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </CommandList>
    );
  }
);

SearchResultsList.displayName = 'SearchResultsList';

export default SearchResultsList;

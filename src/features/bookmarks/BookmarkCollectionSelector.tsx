'use client';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { usePaginatedCollections } from '@/features/collections/collection.api';
import {
  Collection,
  CollectionWithBookmarkCount,
} from '@/features/collections/collection.types';
import { SEARCH_QUERY_DEBOUNCE_WAIT_MS } from '@/features/search/search.constants';
import { useDebounce } from '@/hooks/useDebounce';
import { Nullable } from '@/lib/common.types';
import { flattenInfiniteData } from '@/lib/query/infinite/queryUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefCallBack } from 'react-hook-form';

interface BookmarkCollectionSelectorProps {
  triggerRef: React.RefObject<HTMLButtonElement> | RefCallBack;
  selectedCollectionId: Nullable<CollectionWithBookmarkCount['id']>;
  onSelect: (collectionId: Collection['id']) => void;
}

const BookmarkCollectionSelector = ({
  triggerRef,
  selectedCollectionId,
  onSelect,
}: BookmarkCollectionSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, SEARCH_QUERY_DEBOUNCE_WAIT_MS);
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    usePaginatedCollections(debouncedQuery, isOpen);

  const allCollections = useMemo(() => {
    return flattenInfiniteData(data);
  }, [data]);

  const selectedCollection: CollectionWithBookmarkCount | null = useMemo(() => {
    return (
      allCollections.find(
        (collection) => collection.id === selectedCollectionId
      ) || null
    );
  }, [allCollections, selectedCollectionId]);

  const handleCollectionSelect = useCallback(
    (collectionId: string) => {
      onSelect(+collectionId);
      setIsOpen(false);
    },
    [onSelect]
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isOpen) {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.collections.list(),
        exact: false,
      });
    }
  }, [isOpen, queryClient]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild ref={triggerRef} className="w-full">
        <Button variant="outline" className="justify-start">
          {selectedCollection?.name || 'Select a collection'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command shouldFilter={false} className="w-full">
          <CommandInput
            placeholder="Search for collections..."
            value={query}
            onValueChange={setQuery}
          />
          <CollectionSelectorList
            allCollections={allCollections}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isPending={isPending}
            onCollectionSelect={handleCollectionSelect}
            query={query}
          />
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CollectionSelectorListProps {
  isPending: boolean;
  allCollections: CollectionWithBookmarkCount[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: ReturnType<typeof usePaginatedCollections>['fetchNextPage'];
  onCollectionSelect: (collectionId: string) => void;
  query: string;
}

const CollectionSelectorList = memo(
  ({
    isPending,
    allCollections,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    onCollectionSelect,
    query,
  }: CollectionSelectorListProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      getScrollElement: () => parentRef.current,
      count: allCollections.length,
      estimateSize: () => 40,
      overscan: 5,
    });

    const items = virtualizer.getVirtualItems();

    useEffect(() => {
      if (allCollections.length === 0) return;

      const lastRow = items[items.length - 1];
      if (!lastRow) return;

      if (
        lastRow.index >= allCollections.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    }, [
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      items,
      allCollections.length,
    ]);

    return (
      <CommandList ref={parentRef} className="w-full">
        {isPending ? (
          <div className="py-6 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <LoadingSpinner />
              <p>Searching...</p>
            </div>
          </div>
        ) : allCollections.length === 0 && !isPending && !isFetchingNextPage ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No collections found {query && ` for "${query}"`}
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
                const collection = allCollections[virtualRow.index];
                return (
                  <CommandItem
                    value={collection.id.toString()}
                    key={collection.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onSelect={onCollectionSelect}
                    className="border-b last:border-b-0 rounded-none"
                  >
                    {collection.name}
                  </CommandItem>
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
      </CommandList>
    );
  }
);

CollectionSelectorList.displayName = 'CollectionSelectorList';

export default BookmarkCollectionSelector;

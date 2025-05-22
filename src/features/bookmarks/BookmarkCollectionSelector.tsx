'use client';
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
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { SEARCH_QUERY_DEBOUNCE_WAIT_MS } from '@/features/search/search.constants';
import { useDebounce } from '@/hooks/useDebounce';
import { Nullable } from '@/lib/common.types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface BookmarkCollectionSelectorProps {
  triggerRef: React.RefObject<HTMLButtonElement>;
  selectedCollectionId: Nullable<CollectionWithBookmarkCount['id']>;
}

const BookmarkCollectionSelector = ({
  triggerRef,
  selectedCollectionId,
}: BookmarkCollectionSelectorProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, SEARCH_QUERY_DEBOUNCE_WAIT_MS);
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    usePaginatedCollections(debouncedQuery);

  const allCollections = useMemo(() => {
    return data?.pages.flatMap((page) => page.collections) ?? [];
  }, [data]);

  const selectedCollection: CollectionWithBookmarkCount | null = useMemo(() => {
    return (
      allCollections.find(
        (collection) => collection.id === selectedCollectionId
      ) || null
    );
  }, [allCollections, selectedCollectionId]);

  const parentRef = useRef<HTMLDivElement>(null);
  const { ref: sentinelRef, inView: isSentinelInView } = useInView();

  const virtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: allCollections.length,
    estimateSize: () => 40,
    overscan: 10,
  });

  useEffect(() => {
    if (!isSentinelInView || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSentinelInView]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
          <CommandList ref={parentRef} className="w-full">
            {isPending ? (
              <div className="py-6 text-center text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p>Searching...</p>
                </div>
              </div>
            ) : allCollections.length === 0 && !isPending ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No collections found {query && ` for "${query}"`}
              </div>
            ) : (
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
                      ref={
                        virtualRow.index === allCollections.length - 1
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
                      onSelect={() => {
                        collection.id.toString();
                        setOpen(false);
                      }}
                      className="border-b last:border-b-0"
                    >
                      {collection.name}
                    </CommandItem>
                  );
                })}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BookmarkCollectionSelector;

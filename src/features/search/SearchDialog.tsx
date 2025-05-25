'use client';

import { CommandDialog, CommandInput } from '@/components/ui/Command';
import ActionShortcut from '@/features/search/ActionShortcut';
import { useSearch } from '@/features/search/search.api';
import { SEARCH_QUERY_DEBOUNCE_WAIT_MS } from '@/features/search/search.constants';
import { SearchResult, SearchResultType } from '@/features/search/search.types';
import SearchResultsList from '@/features/search/SearchResultsList';
import { useDebounce } from '@/hooks/useDebounce';
import { flattenInfiniteData } from '@/lib/query/infinite/queryUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PeekState {
  shouldShow: boolean;
  type: SearchResultType | null;
}

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
  const [peekState, setPeekState] = useState<PeekState>({
    shouldShow: false,
    type: null,
  });
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_QUERY_DEBOUNCE_WAIT_MS);
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSearch({
      query: debouncedQuery,
      enabled: isOpen,
    });

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.search.list(),
        exact: false,
      });
    };
  }, [queryClient]);

  const allResults = useMemo(() => {
    return flattenInfiniteData(data);
  }, [data]);

  const handleItemPeek = useCallback((item: SearchResult) => {
    setPeekState((prev) => {
      if (prev.shouldShow && prev.type === item.type) {
        return prev;
      }

      return {
        shouldShow: true,
        type: item.type,
      };
    });
  }, []);

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
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        onItemPeek={handleItemPeek}
      />

      {peekState.shouldShow ? (
        <footer className="border-t bg-popover px-4 py-3 hidden lg:block">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {peekState.type === 'bookmark' && (
              <>
                <ActionShortcut label="Open in new tab" keys={['⌘', '↵']} />
                <ActionShortcut label="Copy link" keys={['⌘', 'L']} />
                <ActionShortcut label="Edit" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
              </>
            )}
          </div>
        </footer>
      ) : null}
    </CommandDialog>
  );
};

export default SearchCommandDialog;

'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import ActionShortcut from '@/features/search/ActionShortcut';
import { useSearch } from '@/features/search/search.api';
import { SearchResult } from '@/features/search/search.types';
import SearchDialogItem from '@/features/search/SearchDialogItem';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatTypeName = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1) + 's';
};

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
  const [peekingItem, setPeekingItem] = useState<SearchResult | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data, isPending } = useSearch({ query: debouncedQuery });

  const groupedResults = useMemo(() => {
    return (
      data?.pages
        .flatMap((page) => page.results)
        .reduce(
          (acc, result) => {
            if (!acc[result.type]) {
              acc[result.type] = [];
            }
            acc[result.type].push(result);
            return acc;
          },
          {} as Record<string, (typeof data)['pages'][0]['results']>
        ) || {}
    );
  }, [data?.pages]);

  const resultTypes = useMemo(() => {
    return Object.keys(groupedResults);
  }, [groupedResults]);

  const handleItemSelect = (result: SearchResult) => {
    if (result.type === 'collection') {
      router.push(`/collections/${result.id}`);
      onOpenChange(false);
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      commandProps={{
        shouldFilter: false,
      }}
      dialogContentClassName="w-full max-w-2xl sm:max-w-3xl"
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
      <CommandList className="max-h-[80vh] overflow-y-auto w-full lg:pb-12">
        {isPending ? (
          <div className="py-6 text-center text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p>Searching...</p>
            </div>
          </div>
        ) : (
          <>
            {resultTypes.length === 0 && !isPending ? (
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found for &quot;{query}&quot;
                </div>
              </CommandEmpty>
            ) : null}
            {resultTypes.length > 0 &&
              resultTypes.map((type, index) => (
                <div key={type}>
                  {index > 0 && <CommandSeparator />}
                  <CommandGroup heading={formatTypeName(type)}>
                    {groupedResults[type].map((result) => (
                      <SearchDialogItem
                        result={result}
                        key={`${result.id}-${result.type}`}
                        onSelect={handleItemSelect}
                        onPeek={setPeekingItem}
                      />
                    ))}
                  </CommandGroup>
                </div>
              ))}
          </>
        )}
      </CommandList>
      {peekingItem ? (
        <footer className="absolute bottom-0 left-0 right-0 border-t bg-background px-4 py-3 hidden lg:block">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {peekingItem?.type === 'bookmark' && (
              <>
                <ActionShortcut label="Open in new tab" keys={['⌘', '↵']} />
                <ActionShortcut label="Copy link" keys={['⌘', 'C']} />
                <ActionShortcut label="Edit" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
              </>
            )}
            {peekingItem?.type === 'collection' && (
              <>
                <ActionShortcut label="Open collection" keys={['⌘', '↵']} />
                <ActionShortcut label="Rename" keys={['⌘', 'E']} />
                <ActionShortcut label="Delete" keys={['⌘', '⌫']} />
                <ActionShortcut label="Add bookmark" keys={['⌘', 'B']} />
              </>
            )}
          </div>
        </footer>
      ) : null}
    </CommandDialog>
  );
};

export default SearchCommandDialog;

'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useSearch } from '@/features/search/search.api';
import { useDebounce } from '@/hooks/use-debounce';

import { BookmarkIcon, FolderIcon, HashIcon, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

interface SearchCommandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'bookmark':
      return <BookmarkIcon className="mr-2" />;
    case 'collection':
      return <FolderIcon className="mr-2" />;
    case 'tag':
      return <HashIcon className="mr-2" />;
    default:
      return <SearchIcon className="mr-2" />;
  }
};

const formatTypeName = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1) + 's';
};

const SearchCommandDialog = ({
  isOpen,
  onOpenChange,
}: SearchCommandDialogProps) => {
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

  const resultTypes = Object.keys(groupedResults);

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onOpenChange}
      commandProps={{
        shouldFilter: false,
      }}
    >
      <div className="flex items-center border-b px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Search bookmarks, tags, collections..."
          value={query}
          onValueChange={setQuery}
          className="border-0 focus:ring-0 focus-visible:ring-0"
        />
      </div>
      <CommandList className="max-h-[80vh] overflow-y-auto">
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
                      <CommandItem
                        key={`${result.id}-${result.type}`}
                        className="flex items-center px-4 py-2"
                      >
                        {getIconForType(result.type)}
                        <span>{result.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommandDialog;

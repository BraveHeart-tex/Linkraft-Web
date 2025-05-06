'use client';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useBookmarkMetadataUpdate } from '@/features/bookmarks/bookmark.api';
import {
  Bookmark,
  BookmarkMetadataResponse,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { updatePaginatedBookmark } from '@/features/bookmarks/bookmark.utils';
import { formatIsoDate } from '@/lib/dateUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  ExternalLink,
  Folder,
  Globe,
  LoaderIcon,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import BookmarkActions from './BookmarkActions';

interface BookmarkCardProps {
  bookmark: Bookmark;
  isSelected?: boolean;
  onSelect?: (bookmark: Bookmark) => void;
}

const BookmarkCard = ({
  bookmark,
  isSelected,
  onSelect,
}: BookmarkCardProps) => {
  const formattedDate = formatIsoDate(bookmark.createdAt, 'DD');

  const domain: string = useMemo(() => {
    try {
      return new URL(bookmark.url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  }, [bookmark.url]);

  const queryClient = useQueryClient();

  const handleBookmarkUpdate = useCallback(
    (metadata: BookmarkMetadataResponse) => {
      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list(),
        (old) =>
          old
            ? updatePaginatedBookmark(old, bookmark.id, (b) => ({
                ...b,
                title: metadata.title || b.title,
                faviconUrl: metadata?.faviconUrl || b.faviconUrl,
                isMetadataPending: false,
              }))
            : old
      );
    },
    [bookmark.id, queryClient]
  );

  const handleCardClick = () => {
    if (!onSelect) return;
    onSelect(bookmark);
  };

  useBookmarkMetadataUpdate(bookmark.id, handleBookmarkUpdate);

  return (
    <Card
      className={cn(
        'w-full',
        isSelected && 'outline outline-sky-500',
        onSelect && 'cursor-pointer'
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="h-8 w-8 overflow-hidden">
          {bookmark.isMetadataPending ? (
            <LoaderIcon className="text-muted-foreground animate-spin" />
          ) : (
            <img
              src={bookmark.faviconUrl || '/globe.svg'}
              alt={`${bookmark.title} favicon`}
              className="h-full w-full object-cover rounded-md"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/globe.svg';
              }}
            />
          )}
        </div>
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight text-foreground line-clamp-1 lg:line-clamp-2">
              {bookmark.title}
            </h3>
            <div
              className={cn(
                'flex items-center gap-2',
                onSelect && 'opacity-50 pointer-events-none'
              )}
              aria-disabled={!!onSelect}
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                aria-label={`Visit ${bookmark.title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <BookmarkActions bookmark={bookmark} />
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {bookmark.description}
        </p>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'mt-2 inline-flex items-center text-xs text-muted-foreground hover:underline',
            onSelect && 'opacity-50 pointer-events-none'
          )}
        >
          <Globe className="mr-1 h-3 w-3" />
          {domain}
        </a>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {bookmark?.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {bookmark?.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
        {bookmark?.collection ? (
          <div className="flex items-center text-xs text-muted-foreground">
            <Folder className="mr-1 h-3 w-3" />
            {bookmark?.collection?.name}
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default BookmarkCard;

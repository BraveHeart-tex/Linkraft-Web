'use client';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/Card';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import BookmarkActions from '@/features/bookmarks/BookmarkCardActions';
import BookmarkFavicon from '@/features/bookmarks/BookmarkFavicon';
import { formatIsoDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';
import { Calendar, ExternalLink, Folder, Globe } from 'lucide-react';
import { memo, useMemo } from 'react';

interface BookmarkCardProps {
  bookmark: Bookmark;
  isSelected?: boolean;
  onSelect?: (bookmark: Bookmark) => void;
}

const BookmarkCard = memo(
  ({ bookmark, isSelected, onSelect }: BookmarkCardProps) => {
    const formattedDate = formatIsoDate(bookmark.createdAt, 'DD');

    const domain: string = useMemo(() => {
      try {
        return new URL(bookmark.url).hostname.replace('www.', '');
      } catch {
        return '';
      }
    }, [bookmark.url]);

    const handleCardClick = () => {
      if (!onSelect) return;
      onSelect(bookmark);
    };

    return (
      <Card
        className={cn(
          'w-full',
          isSelected && 'border-sky-500 transition-none',
          onSelect && 'cursor-pointer'
        )}
        onMouseDown={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <BookmarkFavicon
            alt={`${domain} favicon`}
            faviconUrl={bookmark.faviconUrl}
            isMetadataPending={bookmark.isMetadataPending}
          />
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
  }
);

BookmarkCard.displayName = 'BookmarkCard';

export default BookmarkCard;

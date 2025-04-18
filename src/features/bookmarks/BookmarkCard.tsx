'use client';
import { useBookmarkMetadataUpdate } from '@/features/bookmarks/bookmark.api';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Calendar, Folder, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIsoDate } from '@/lib/dateUtils';
import BookmarkActions from './BookmarkActions';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

const exampleTags = ['advice', 'tech', 'video', 'learning'];

const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const formattedDate = formatIsoDate(bookmark.createdAt, 'DD');
  const domain = new URL(bookmark.url).hostname.replace('www.', '');
  const queryClient = useQueryClient();

  useBookmarkMetadataUpdate(bookmark.id, (metadata) => {
    queryClient.setQueryData<Bookmark[]>(
      [QUERY_KEYS.bookmarks.getBookmarks],
      (old) => {
        if (!old) return [];

        return old.map((oldBookmark) => {
          if (oldBookmark.id === bookmark.id) {
            return {
              ...oldBookmark,
              title: metadata.title,
              faviconUrl: metadata?.faviconUrl,
              isMetadataPending: false,
            };
          }
          return oldBookmark;
        });
      }
    );
  });

  return (
    <Card className={cn('w-full transition-all hover:shadow-md')}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div className="h-8 w-8 overflow-hidden">
          {bookmark.faviconUrl ? (
            <img
              src={bookmark.faviconUrl || '/placeholder.svg'}
              alt={`${bookmark.title} favicon`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight">
              {bookmark.title}
            </h3>
            <div className="flex items-center gap-2">
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
          className="mt-2 inline-flex items-center text-xs text-muted-foreground hover:underline"
        >
          <Globe className="mr-1 h-3 w-3" />
          {domain}
        </a>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap gap-1">
          {exampleTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Folder className="mr-1 h-3 w-3" />
          {'My collection'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookmarkCard;

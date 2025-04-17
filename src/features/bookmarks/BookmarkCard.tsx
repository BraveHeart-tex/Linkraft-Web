'use client';
import { useBookmarkUpdate } from '@/features/bookmarks/bookmark.api';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  const queryClient = useQueryClient();

  const onBookmarkUpdate = (metadata: { title: string }) => {
    queryClient.setQueryData<Bookmark[]>(
      [QUERY_KEYS.bookmarks.getBookmarks],
      (old) => {
        if (!old) return [];

        return old.map((oldBookmark) => {
          if (oldBookmark.id === bookmark.id) {
            return {
              ...oldBookmark,
              title: metadata.title,
              isMetadataPending: false,
            };
          }
          return oldBookmark;
        });
      }
    );
  };

  useBookmarkUpdate(bookmark.id, onBookmarkUpdate);

  return (
    <div>
      {bookmark.id} - {bookmark.title}
    </div>
  );
};

export default BookmarkCard;

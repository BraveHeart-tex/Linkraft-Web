'use client';
import { BookmarkMetadataResponse } from '@/features/bookmarks/bookmark.types';
import { useSocketEvent } from '@/hooks/useSocketEvent';

export const useBookmarkMetadataUpdates = (
  handler: (data: BookmarkMetadataResponse) => void
) => {
  useSocketEvent('bookmark:update', (data) => {
    console.log('data', data);
    handler(data);
  });
};

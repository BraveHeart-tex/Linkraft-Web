'use client';
import { BookmarkMetadataResponse } from '@/features/bookmarks/bookmark.types';
import { useSocketEvent } from '@/hooks/useSocketEvent';
import { SOCKET_EVENTS } from '@/lib/ws/socket.constants';

export const useBookmarkMetadataUpdates = (
  handler: (data: BookmarkMetadataResponse) => void
) => {
  useSocketEvent(SOCKET_EVENTS.BOOKMARK.UPDATE, handler);
};

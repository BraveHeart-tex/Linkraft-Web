import {
  Bookmark,
  BookmarkMetadataResponse,
} from '@/features/bookmarks/bookmark.types';
import { NestedValueOf } from '@/lib/common.types';
import { BookmarkImportStatus } from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { SOCKET_EVENTS } from '@/lib/ws/socket.constants';

export type SocketEventPayloads = {
  'import:subscribe': { importJobId: string };
  'import:unsubscribe': { importJobId: string };
  'import:progress': {
    importJobId: string;
    progress: number;
    status: BookmarkImportStatus;
  };
  'import:complete': { importJobId: string; summary: string };
  'import:error': { importJobId: string; error: string };

  'bookmark:subscribe': { bookmarkId: Bookmark['id'] };
  'bookmark:unsubscribe': { bookmarkId: Bookmark['id'] };
  'bookmark:update': BookmarkMetadataResponse;
};
export type SocketEvent = NestedValueOf<typeof SOCKET_EVENTS>;

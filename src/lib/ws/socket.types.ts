import { BookmarkMetadataResponse } from '@/features/bookmarks/bookmark.types';
import { NestedValueOf } from '@/lib/common.types';
import { BookmarkImportStatus } from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { SOCKET_EVENTS } from '@/lib/ws/socket.constants';

export type SocketEventPayloads = {
  [SOCKET_EVENTS.BOOKMARK.UPDATE]: BookmarkMetadataResponse;
  [SOCKET_EVENTS.IMPORT.PROGRESS]: {
    importJobId: string;
    progress: number;
    status: BookmarkImportStatus;
  };
  [SOCKET_EVENTS.IMPORT.COMPLETE]: { importJobId: string; summary: string };
  [SOCKET_EVENTS.IMPORT.ERROR]: { importJobId: string; error: string };
};

export type SocketEvent = NestedValueOf<typeof SOCKET_EVENTS>;

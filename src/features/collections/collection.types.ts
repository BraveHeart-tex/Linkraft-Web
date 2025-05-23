import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { PaginatedResponse } from '@/lib/api/api.types';
import { InfiniteData } from '@tanstack/react-query';

export interface Collection {
  id: number;
  name: string;
  userId: number;
  description: string | null;
  createdAt: string;
  isDeleted: boolean;
  color: string;
}

export type CollectionWithBookmarkCount = Collection & {
  bookmarkCount: number;
};

export type CollectionWithBookmarks = Collection & {
  bookmarks: Bookmark[];
  nextBookmarkCursor: Bookmark['id'] | null;
};

export type GetCollectionsResponse =
  PaginatedResponse<CollectionWithBookmarkCount>;

export type PaginatedCollectionsPage = {
  collections: CollectionWithBookmarkCount[];
  nextCursor: number | null | undefined;
};

export type InfiniteCollectionsData = InfiniteData<PaginatedCollectionsPage>;

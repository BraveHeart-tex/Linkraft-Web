import { User } from '@/features/auth/auth.types';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { PaginatedResponse } from '@/lib/api/api.types';
import { InfiniteQueryData } from '@/lib/query/infinite/types';

export interface Collection {
  id: string;
  name: string;
  userId: User['id'];
  description: string | null;
  createdAt: string;
  parentId: Collection['id'];
  displayOrder: number;
}

export type CollectionWithBookmarkCount = Collection & {
  bookmarkCount: number;
};

export type SlimCollection = Pick<Collection, 'id' | 'name'>;

export type CollectionWithBookmarks = Collection & {
  bookmarks: Bookmark[];
  nextBookmarkCursor: Bookmark['id'] | null;
};

export type GetCollectionsResponse =
  PaginatedResponse<CollectionWithBookmarkCount>;

export type InfiniteCollectionsData =
  InfiniteQueryData<CollectionWithBookmarkCount>;

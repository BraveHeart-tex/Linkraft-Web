import { Bookmark } from '@/features/bookmarks/bookmark.types';

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

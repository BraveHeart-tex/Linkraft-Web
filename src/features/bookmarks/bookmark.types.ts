import { PaginatedResponse } from '@/lib/api/api.types';
import { Nullable } from '@/lib/common.types';
import { InfiniteQueryData } from '@/lib/query/infinite/types';
import { z } from 'zod';
import { Collection, SlimCollection } from '../collections/collection.types';
import { Tag } from '../tags/tag.types';
import { createBookmarkSchema } from './bookmark.schema';

export interface Bookmark {
  id: number;
  createdAt: string;
  userId: number;
  url: string;
  title: string;
  description: Nullable<string>;
  deletedAt: Nullable<string>;
  isMetadataPending: boolean;
  faviconUrl: Nullable<string>;
  collectionId: Collection['id'];
  collection?: Nullable<SlimCollection>;
  tags?: Nullable<
    {
      id: number;
      name: string;
    }[]
  >;
}

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;

export type UpdateBookmarkDto = Partial<CreateBookmarkDto> & {
  id: Bookmark['id'];
};

export interface UpdateBookmarkResponse {
  success: boolean;
  updatedBookmark: Bookmark;
  createdTags: Tag[];
}

export type GetBookmarksResponse = PaginatedResponse<Bookmark>;

export type InfiniteBookmarksData = InfiniteQueryData<Bookmark>;

export interface BookmarkMetadataResponse {
  bookmarkId: Bookmark['id'];
  title: string;
  isMetadataPending: boolean;
  faviconUrl: string;
}

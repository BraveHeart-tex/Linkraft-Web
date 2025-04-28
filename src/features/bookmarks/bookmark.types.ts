import { z } from 'zod';
import { createBookmarkSchema } from './bookmark.schema';
import { Collection } from '../collections/collection.types';
import { Tag } from '../tags/tag.types';
import { Nullable } from '@/lib/common.types';

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
  collection: Nullable<Pick<Collection, 'id' | 'name'>>;

  tags: Nullable<
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

export interface GetBookmarksResponse {
  items: Bookmark[];
  nextCursor: Nullable<number>;
}

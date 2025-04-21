import { z } from 'zod';
import { createBookmarkSchema } from './bookmark.schema';
import { Collection } from '../collections/collection.types';

export interface Bookmark {
  id: number;
  createdAt: string;
  userId: number;
  url: string;
  title: string;
  description: string | null;
  deletedAt: string | null;
  isMetadataPending: boolean;
  faviconUrl: string | null;
  collection: Pick<Collection, 'id' | 'name'> | null;

  tags:
    | {
        id: number;
        name: string;
      }[]
    | null;
}

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;

export type UpdateBookmarkDto = Partial<CreateBookmarkDto> & {
  id: Bookmark['id'];
};

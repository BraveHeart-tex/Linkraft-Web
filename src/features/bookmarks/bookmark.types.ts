import { z } from 'zod';
import { createBookmarkSchema } from './bookmark.schema';

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

  tags: {
    id: number;
    name: string;
  }[];
}

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;

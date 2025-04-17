import { z } from 'zod';
import { createBookmarkSchema } from './bookmark.schema';

export interface Bookmark {
  id: number;
  createdAt: Date | null;
  userId: number;
  url: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  deletedAt: Date | null;
  isMetadataPending: boolean;
}

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;

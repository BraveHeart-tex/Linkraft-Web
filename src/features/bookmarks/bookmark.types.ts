import { z } from 'zod';
import { createBookmarkSchema } from './bookmark.schema';

export interface Bookmark {
  id: number;
  createdAt: Date;
  userId: number;
  url: string;
  title: string;
  description: string | null;
  deletedAt: Date | null;
  isMetadataPending: boolean;
  faviconUrl: string | null;
}

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;

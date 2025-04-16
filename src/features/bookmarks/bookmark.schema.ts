import { z } from 'zod';

export const createBookmarkSchema = z.object({
  id: z.number().optional(),
  url: z
    .string({ required_error: 'URL is required' })
    .url('Please enter a valid URL'),
  title: z.string().max(255, 'Title must be under 255 characters').optional(),
  description: z.string().max(10_000, 'Description is too long').optional(),
  thumbnail: z
    .string()
    .url('Thumbnail must be a valid URL')
    .max(255, 'Thumbnail URL is too long')
    .optional()
    .nullable(),
  collectionId: z.number().nullable(),
});

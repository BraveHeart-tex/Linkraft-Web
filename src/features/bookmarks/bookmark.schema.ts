import { z } from 'zod';

export const CreateBookmarkSchema = z.object({
  id: z.string().optional(),
  url: z
    .string({ required_error: 'URL is required' })
    .url('Please enter a valid URL'),
  title: z.string().max(255, 'Title must be under 255 characters').nullable(),
  description: z.string().max(10_000, 'Description is too long').nullable(),
  collectionId: z.string().nullable(),
  tags: z
    .object({
      label: z.string(),
      value: z.string(),
      __isNew__: z.boolean().optional(),
    })
    .array(),
  existingTagIds: z.string().array().nullable().optional(),
  newTags: z.string().array().nullable().optional(),
});

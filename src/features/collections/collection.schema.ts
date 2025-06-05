import { Collection } from '@/features/collections/collection.types';
import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot exceed 255 characters'),
});

export const RenameCollectionSchema = CreateCollectionSchema.pick({
  name: true,
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

export type RenameCollectionInput = z.infer<typeof RenameCollectionSchema> & {
  id: Collection['id'];
};

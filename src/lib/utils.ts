import { SelectOption } from '@/components/ui/MultiSelect';
import { MAX_COLLECTION_TITLE_LENGTH } from '@/features/collections/collection.constants';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const parseTags = (
  selectedTags: SelectOption[]
): { existingTagIds: string[]; newTags: string[] } => {
  const existingTagIds: string[] = [];
  const newTags: string[] = [];

  selectedTags.forEach((tag) => {
    if (tag.__isNew__) {
      newTags.push(tag.label.trim());
    } else {
      existingTagIds.push(tag.value);
    }
  });

  return { existingTagIds, newTags };
};

export const bytesToMib = (bytes: number): number => {
  return bytes / (1024 * 1024);
};

export const withStopPropagation = <T extends React.SyntheticEvent>(
  handler: (event: T) => void
): ((event: T) => void) => {
  return (event: T) => {
    event.stopPropagation();
    handler(event);
  };
};

export const ensureCollectionTitleLength = (title: string): string =>
  title.length > MAX_COLLECTION_TITLE_LENGTH
    ? title.slice(0, MAX_COLLECTION_TITLE_LENGTH)
    : title;

export const sortCollectionByDisplayOrder = (
  a: CollectionWithBookmarkCount,
  b: CollectionWithBookmarkCount
): number => a.displayOrder - b.displayOrder;

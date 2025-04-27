import { SelectOption } from '@/components/ui/multi-select';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const generateAvatarFallback = (visibleName: string): string => {
  if (!visibleName?.trim()) return '?';

  const parts = visibleName.trim().split(/\s+/);
  const firstInitial = parts[0]?.[0]?.toUpperCase() ?? '';

  const secondInitial = parts[1]?.[0]?.toUpperCase() ?? '';

  return firstInitial + secondInitial || firstInitial || '?';
};

export const addTypedCustomEventListener = <T>(
  type: string,
  handler: (event: CustomEvent<T>) => void
): (() => void) => {
  const wrapped = (event: Event) => {
    handler(event as CustomEvent<T>);
  };
  window.addEventListener(type, wrapped);
  return () => window.removeEventListener(type, wrapped);
};

export const parseTags = (
  selectedTags: SelectOption[]
): { existingTagIds: number[]; newTags: string[] } => {
  const existingTagIds: number[] = [];
  const newTags: string[] = [];

  selectedTags.forEach((tag) => {
    if (tag.__isNew__) {
      newTags.push(tag.label.trim());
    } else {
      existingTagIds.push(+tag.value);
    }
  });

  return { existingTagIds, newTags };
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateAvatarFallback = (visibleName: string): string => {
  if (!visibleName?.trim()) return '?';

  const parts = visibleName.trim().split(/\s+/);
  const firstInitial = parts[0]?.[0]?.toUpperCase() ?? '';

  const secondInitial = parts[1]?.[0]?.toUpperCase() ?? '';

  return firstInitial + secondInitial || firstInitial || '?';
};

export const CUSTOM_EVENT_KEYS = {
  OPEN_EDIT_COLLECTION_DIALOG: 'OPEN_EDIT_COLLECTION_DIALOG',
};

export function addTypedCustomEventListener<T>(
  type: string,
  handler: (event: CustomEvent<T>) => void
) {
  const wrapped = (event: Event) => {
    handler(event as CustomEvent<T>);
  };
  window.addEventListener(type, wrapped);
  return () => window.removeEventListener(type, wrapped);
}

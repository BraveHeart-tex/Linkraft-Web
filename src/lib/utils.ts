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

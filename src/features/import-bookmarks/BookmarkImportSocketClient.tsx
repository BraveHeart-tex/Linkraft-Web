'use client';

import { useBookmarkImportSocketProgress } from '@/hooks/bookmark-import/useBookmarkImportSocketProgress';

export function ImportSocketClient() {
  useBookmarkImportSocketProgress();
  return null;
}

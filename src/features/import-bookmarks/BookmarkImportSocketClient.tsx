'use client';

import { useBookmarkImportSocketProgress } from '@/hooks/bookmark-import/useBookmarkImportSocketProgress';

const ImportSocketClient = () => {
  useBookmarkImportSocketProgress();
  return null;
};

export default ImportSocketClient;

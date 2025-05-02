import { create } from 'zustand';

export type BookmarkImportStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

interface ImportStore {
  importJobId: string | null;
  progress: number;
  status: BookmarkImportStatus;
  setImportJobId: (id: string | null) => void;
  setProgress: (progress: number, status: BookmarkImportStatus) => void;
  reset: () => void;
}

export const useBookmarkImportStore = create<ImportStore>((set) => ({
  importJobId: null,
  progress: 0,
  status: 'pending',
  setImportJobId: (id) =>
    set({ importJobId: id, progress: 0, status: 'pending' }),
  setProgress: (progress, status) => set({ progress, status }),
  reset: () => set({ importJobId: null, progress: 0, status: 'pending' }),
}));

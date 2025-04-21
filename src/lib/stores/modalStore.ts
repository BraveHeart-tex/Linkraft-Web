import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { create } from 'zustand';

export type ModalType = {
  type: 'edit-bookmark';
  payload: { bookmark: Bookmark };
};

type ModalState = ModalType | null;

interface ModalStore {
  modal: ModalState;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));

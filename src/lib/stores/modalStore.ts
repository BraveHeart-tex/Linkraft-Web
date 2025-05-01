import { create } from 'zustand';
import { Nullable } from '../common.types';
import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { Collection } from '@/features/collections/collection.types';

export type ModalType =
  | {
      type: 'edit-bookmark';
      payload: { bookmark: Bookmark };
    }
  | {
      type: 'create-collection';
      payload?: undefined;
    }
  | {
      type: 'create-bookmark';
      payload?: undefined;
    }
  | {
      type: 'edit-collection';
      payload: { collection: Collection };
    };

type ModalState = Nullable<ModalType>;

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

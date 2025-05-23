import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { Collection } from '@/features/collections/collection.types';
import { ApiResponse } from '@/lib/api/api.types';
import { create } from 'zustand';
import { Nullable } from '../../common.types';

export const MODAL_TYPES = {
  EDIT_BOOKMARK: 'edit-bookmark',
  CREATE_COLLECTION: 'create-collection',
  IMPORT_BOOKMARKS: 'import-bookmarks',
  CREATE_BOOKMARK: 'create-bookmark',
  EDIT_COLLECTION: 'edit-collection',
  SEARCH: 'search',
} as const;

export type ModalType =
  | {
      type: typeof MODAL_TYPES.EDIT_BOOKMARK;
      payload: { bookmark: Bookmark };
    }
  | {
      type: typeof MODAL_TYPES.CREATE_COLLECTION;
      payload?: { onSave?: (data: ApiResponse<Collection>) => void };
    }
  | {
      type: typeof MODAL_TYPES.IMPORT_BOOKMARKS;
      payload?: undefined;
    }
  | {
      type: typeof MODAL_TYPES.CREATE_BOOKMARK;
      payload?: { forCollectionId?: Collection['id'] };
    }
  | {
      type: typeof MODAL_TYPES.EDIT_COLLECTION;
      payload: { collection: Collection; onUpdate?: () => void };
    }
  | {
      type: typeof MODAL_TYPES.SEARCH;
      payload?: undefined;
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

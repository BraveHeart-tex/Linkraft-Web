'use client';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
import FileImportDialog from '@/features/import-bookmarks/FileImportDialog';
import SearchCommandDialog from '@/features/search/SearchDialog';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';

const ModalHost = () => {
  const modal = useModalStore((s) => s.modal);
  const closeModal = useModalStore((s) => s.closeModal);

  if (!modal) return null;

  switch (modal.type) {
    case MODAL_TYPES.EDIT_BOOKMARK: {
      return (
        <BookmarkFormDialog
          isOpen
          onOpenChange={closeModal}
          initialData={modal.payload.bookmark}
        />
      );
    }

    case MODAL_TYPES.CREATE_BOOKMARK: {
      return (
        <BookmarkFormDialog
          isOpen
          onOpenChange={closeModal}
          preSelectedCollection={modal.payload?.preSelectedCollection}
        />
      );
    }

    case MODAL_TYPES.IMPORT_BOOKMARKS: {
      return <FileImportDialog isOpen onOpenChange={closeModal} />;
    }

    case MODAL_TYPES.SEARCH: {
      return <SearchCommandDialog isOpen onOpenChange={closeModal} />;
    }

    default:
      return null;
  }
};

export default ModalHost;

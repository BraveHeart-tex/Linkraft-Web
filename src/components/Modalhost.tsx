'use client';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import FileImportDialog from '@/features/import-bookmarks/FileImportDialog';
import SearchCommandDialog from '@/features/search/SearchDialog';
import { useModalStore } from '@/lib/stores/ui/modalStore';

const ModalHost = () => {
  const modal = useModalStore((s) => s.modal);
  const closeModal = useModalStore((s) => s.closeModal);

  if (!modal) return null;

  switch (modal.type) {
    case 'edit-bookmark': {
      return (
        <BookmarkFormDialog
          isOpen
          onOpenChange={closeModal}
          initialData={modal.payload.bookmark}
        />
      );
    }

    case 'edit-collection': {
      return (
        <CollectionFormDialog
          isOpen
          onOpenChange={closeModal}
          initialData={modal.payload.collection}
        />
      );
    }

    case 'create-bookmark': {
      return <BookmarkFormDialog isOpen onOpenChange={closeModal} />;
    }

    case 'import-bookmarks': {
      return <FileImportDialog isOpen onOpenChange={closeModal} />;
    }

    case 'create-collection': {
      return <CollectionFormDialog isOpen onOpenChange={closeModal} />;
    }

    case 'search': {
      return <SearchCommandDialog isOpen onOpenChange={closeModal} />;
    }

    default:
      return null;
  }
};

export default ModalHost;

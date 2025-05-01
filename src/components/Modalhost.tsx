'use client';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { useModalStore } from '@/lib/stores/modalStore';

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

    default:
      return null;
  }
};

export default ModalHost;

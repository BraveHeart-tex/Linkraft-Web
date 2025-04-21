'use client';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
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

    default:
      return null;
  }
};

export default ModalHost;

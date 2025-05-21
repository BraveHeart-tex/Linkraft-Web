'use client';
import { Button } from '@/components/ui/Button';
import {
  MODAL_TYPES,
  ModalType,
  useModalStore,
} from '@/lib/stores/ui/modalStore';

interface AddBookmarkButtonProps {
  modalPayload?: Extract<
    ModalType,
    { type: typeof MODAL_TYPES.CREATE_BOOKMARK }
  >['payload'];
}

const AddBookmarkButton = ({ modalPayload }: AddBookmarkButtonProps) => {
  const openModal = useModalStore((s) => s.openModal);
  const handleAddBookmark = () => {
    openModal({
      type: MODAL_TYPES.CREATE_BOOKMARK,
      payload: modalPayload,
    });
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="mt-4"
      onClick={handleAddBookmark}
    >
      Add Bookmark
    </Button>
  );
};

export default AddBookmarkButton;

'use client';
import { useDeleteCollection } from '@/features/collections/collection.api';
import { Collection } from '@/features/collections/collection.types';
import CollectionActions from '@/features/collections/CollectionActions';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/lib/toast';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface CollectionPageActionsProps {
  collection: Collection;
}

const CollectionPageActions = ({ collection }: CollectionPageActionsProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );
  const { mutate: deleteCollection, isPending: isDeletingCollection } =
    useDeleteCollection({
      onMutate() {
        return { toastId: showLoadingToast('Deleting collection...') };
      },
      onSuccess(_data, _variables, context) {
        showSuccessToast('Collection deleted successfully', {
          id: context.toastId,
        });
      },
      onError(error, _variables, context) {
        showErrorToast('An error occurred while deleting the collection', {
          description: (error as ApiError).message,
          id: context?.toastId,
        });
      },
    });

  const handleDelete = useCallback(() => {
    if (isDeletingCollection) return;
    showConfirmDialog({
      title: 'Delete Collection',
      message: 'Are you sure you want to delete this collection?',
      async onConfirm() {
        deleteCollection({ collectionId: collection.id });
      },
      primaryActionLabel: 'Delete',
      primaryButtonVariant: 'destructive',
      alertText:
        'Deleting this collection will permanently remove all its contents',
    });
  }, [
    collection.id,
    deleteCollection,
    isDeletingCollection,
    showConfirmDialog,
  ]);

  const handleEdit = useCallback(() => {
    if (isDeletingCollection) return;
    openModal({
      type: MODAL_TYPES.EDIT_COLLECTION,
      payload: {
        collection,
        onUpdate: () => router.refresh(),
      },
    });
  }, [collection, isDeletingCollection, openModal, router]);

  // TODO:
  const handleAddBookmarkToCollection = useCallback(() => {
    openModal({
      type: MODAL_TYPES.CREATE_BOOKMARK,
      payload: {
        preSelectedCollection: { id: collection.id, name: collection.name },
      },
    });
  }, [collection.id, collection.name, openModal]);

  // TODO:
  const handleMoveBookmarksToCollection = useCallback(() => {}, []);

  return (
    <CollectionActions
      onDelete={handleDelete}
      onEdit={handleEdit}
      onAddBookmark={handleAddBookmarkToCollection}
      onMoveBookmarks={handleMoveBookmarksToCollection}
    />
  );
};

export default CollectionPageActions;

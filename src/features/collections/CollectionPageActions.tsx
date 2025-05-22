'use client';
import { useDeleteCollection } from '@/features/collections/collection.api';
import { Collection } from '@/features/collections/collection.types';
import CollectionActions from '@/features/collections/CollectionActions';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/lib/toast';
import { ApiError } from 'next/dist/server/api-utils';
import { useRouter } from 'next/navigation';

interface CollectionPageActions {
  collectionId: Collection['id'];
}

const CollectionPageActions = ({ collectionId }: CollectionPageActions) => {
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
        router.push('/collections');
      },
      onError(error, _variables, context) {
        showErrorToast('An error occurred while deleting the collection', {
          description: (error as ApiError).message,
          id: context?.toastId,
        });
      },
    });

  const handleDelete = () => {
    if (isDeletingCollection) return;
    showConfirmDialog({
      title: 'Delete Collection',
      message: 'Are you sure you want to delete this collection?',
      async onConfirm() {
        deleteCollection({ collectionId });
      },
      primaryActionLabel: 'Delete',
      primaryButtonVariant: 'destructive',
      alertText:
        'Deleting this collection will permanently remove all its contents',
    });
  };

  const handleEdit = () => {
    if (isDeletingCollection) return;
  };

  return <CollectionActions onDelete={handleDelete} onEdit={handleEdit} />;
};

export default CollectionPageActions;

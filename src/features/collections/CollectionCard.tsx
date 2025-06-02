'use client';
import { Card, CardContent } from '@/components/ui/Card';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import CollectionActions from '@/features/collections/CollectionActions';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { formatIsoDate, getCurrentTimestamp } from '@/lib/dateUtils';
import {
  removeItemFromInfiniteQueryData,
  updateItemInInfiniteQueryData,
} from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { withStopPropagation } from '@/lib/utils';
import { APP_ROUTES } from '@/routes/appRoutes';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useCallback } from 'react';
import { useDeleteCollection } from './collection.api';
import { Collection, InfiniteCollectionsData } from './collection.types';

interface CollectionCardProps {
  collection: Collection & { bookmarkCount: number };
}

const CollectionCard = memo(({ collection }: CollectionCardProps) => {
  const queryClient = useQueryClient();
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );
  const openModal = useModalStore((s) => s.openModal);
  const router = useRouter();

  const { mutate: deleteCollection } = useDeleteCollection({
    async onMutate(variables) {
      showSuccessToast('Collection deleted successfully.');

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.collections.list(),
      });

      const previousCollections =
        queryClient.getQueryData<InfiniteCollectionsData>(
          QUERY_KEYS.collections.list()
        );

      if (!previousCollections) return;

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list()
      );

      queryClient.setQueryData<InfiniteCollectionsData>(
        QUERY_KEYS.collections.list(),
        (old) =>
          removeItemFromInfiniteQueryData(
            old,
            (item) => item.id !== variables.collectionId
          )
      );

      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list(),
        (old) =>
          updateItemInInfiniteQueryData(old, {
            match: (item) => item.collectionId === variables.collectionId,
            update: (item) => ({
              ...item,
              deletedAt: getCurrentTimestamp(),
            }),
          })
      );

      return { previousCollections, previousBookmarks };
    },
    onError(error, _variables, context) {
      const apiError = error as ErrorApiResponse;
      queryClient.setQueryData(
        QUERY_KEYS.collections.list(),
        context?.previousCollections
      );
      queryClient.setQueryData(
        QUERY_KEYS.bookmarks.list(),
        context?.previousBookmarks
      );
      showErrorToast('An error occurred while deleting the collection', {
        description: apiError.message,
      });
    },
    async onSettled() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collections.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.trashed(),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
        }),
      ]);
    },
  });

  const handleDeleteCollection = withStopPropagation(() => {
    showConfirmDialog({
      title: 'Delete Collection',
      message: 'Are you sure you want to delete this collection?',
      async onConfirm() {
        deleteCollection({ collectionId: collection.id });
      },
      primaryActionLabel: 'Delete',
      primaryButtonVariant: 'destructive',
      alertText: 'Bookmarks inside this collection will be moved to Trash',
    });
  });

  const handleEditCollection = withStopPropagation(() => {
    openModal({
      type: MODAL_TYPES.EDIT_COLLECTION,
      payload: {
        collection,
      },
    });
  });

  const handleClick = withStopPropagation(() => {
    router.push(APP_ROUTES.collection(collection.id));
  });

  const handleAddBookmarkToCollection = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  const handleMoveBookmarksToCollection = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    []
  );

  return (
    <Card
      className="overflow-hidden py-4 cursor-pointer shadow-lg hover:shadow-sm transition-shadow"
      onClick={handleClick}
    >
      <CardContent className="p-4 py-1 space-y-14">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight overflow-hidden truncate">
            {collection.name}
          </h3>
          <CollectionActions
            onEdit={handleEditCollection}
            onDelete={handleDeleteCollection}
            onAddBookmark={handleAddBookmarkToCollection}
            onMoveBookmarks={handleMoveBookmarksToCollection}
          />
        </div>
        <div className="flex items-center w-full justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            <span className="font-bold">{collection.bookmarkCount}</span>
          </div>
          <div className="flex items-center gap-1 font-medium text-xs">
            <CalendarIcon className="h-4 w-4" />
            {formatIsoDate(collection.createdAt, 'MMM dd, yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CollectionCard.displayName = 'CollectionCard';

export default CollectionCard;

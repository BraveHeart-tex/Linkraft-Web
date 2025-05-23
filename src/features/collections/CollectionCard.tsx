'use client';
import { Card, CardContent } from '@/components/ui/Card';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import CollectionActions from '@/features/collections/CollectionActions';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { generateSubtleGradientFromHex } from '@/lib/colorUtils';
import { formatIsoDate } from '@/lib/dateUtils';
import { removeItemFromInfiniteQueryData } from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { APP_ROUTES } from '@/routes/appRoutes';
import { useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CSSProperties, memo, useMemo } from 'react';
import { UserWithoutPasswordHash } from '../auth/auth.types';
import UserAvatar from '../users/UserAvatar';
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

  const user = useMemo(() => {
    return queryClient.getQueryData<UserWithoutPasswordHash>(
      QUERY_KEYS.auth.currentUser()
    );
  }, [queryClient]);

  const { mutate: deleteCollection } = useDeleteCollection({
    async onMutate() {
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
            (item) => item.id !== collection.id
          )
      );

      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list(),
        (old) =>
          removeItemFromInfiniteQueryData(old, (bookmark) =>
            bookmark.collection
              ? bookmark.collection.id !== collection.id
              : true
          )
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
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.collections.list(),
      });
    },
  });

  const generatedCardStyles: CSSProperties = useMemo(() => {
    return {
      backgroundImage: generateSubtleGradientFromHex(collection.color),
      backgroundRepeat: 'no-repeat',
    };
  }, [collection.color]);

  const handleDeleteCollection = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
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
  };

  const handleEditCollection = (event: React.MouseEvent) => {
    event.stopPropagation();

    openModal({
      type: MODAL_TYPES.EDIT_COLLECTION,
      payload: {
        collection,
      },
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(APP_ROUTES.collection(collection.id));
  };

  return (
    <Card
      className="overflow-hidden py-4 cursor-pointer shadow-lg hover:shadow-sm transition-shadow"
      style={generatedCardStyles}
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
          />
        </div>
        <div className="flex items-center w-full justify-between gap-8">
          <UserAvatar
            profilePicture=""
            visibleName={user?.visibleName || ''}
            avatarClassNames="shadow-sm"
          />
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <LinkIcon className="h-4 w-4" />
              <span className="font-bold">{collection.bookmarkCount}</span>
            </div>
            <div className="flex items-center gap-1 font-bold">
              <CalendarIcon className="h-4 w-4" />
              {formatIsoDate(collection.createdAt, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CollectionCard.displayName = 'CollectionCard';

export default CollectionCard;

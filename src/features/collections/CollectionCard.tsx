'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Collection, CollectionWithBookmarkCount } from './collection.types';
import { CalendarIcon, EllipsisIcon, LinkIcon } from 'lucide-react';
import { generateSubtleGradientFromHex } from '@/lib/colorUtils';
import { formatIsoDate } from '@/lib/dateUtils';
import UserAvatar from '../users/UserAvatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { useDeleteCollection } from './collection.api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { CSSProperties, useMemo } from 'react';
import { UserWithoutPasswordHash } from '../auth/auth.types';
import { useModalStore } from '@/lib/stores/modalStore';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import { filterInfiniteBookmarks } from '@/features/bookmarks/bookmark.utils';

interface CollectionCardProps {
  collection: Collection & { bookmarkCount: number };
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const queryClient = useQueryClient();

  const user = useMemo(() => {
    return queryClient.getQueryData<UserWithoutPasswordHash>(
      QUERY_KEYS.auth.currentUser()
    );
  }, [queryClient]);

  const openModal = useModalStore((s) => s.openModal);

  const { mutate: deleteCollection } = useDeleteCollection({
    async onMutate() {
      showSuccessToast('Collection deleted successfully.');

      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.collections.list(),
      });

      const previousCollections = queryClient.getQueryData<
        CollectionWithBookmarkCount[]
      >(QUERY_KEYS.collections.list());

      if (!previousCollections) return;

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list()
      );

      queryClient.setQueryData<CollectionWithBookmarkCount[]>(
        QUERY_KEYS.collections.list(),
        (old) =>
          old
            ? old.filter((oldCollection) => oldCollection.id !== collection.id)
            : old
      );

      queryClient.setQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list(),
        (old) =>
          old
            ? filterInfiniteBookmarks(old, (bookmark) =>
                bookmark.collection
                  ? bookmark.collection.id !== collection.id
                  : true
              )
            : old
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
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );
  const router = useRouter();

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
        'Deleting this collection will permanently remove all its contents and revoke access for everyone',
    });
  };

  const handleEditCollection = (event: React.MouseEvent) => {
    event.stopPropagation();
    openModal({
      type: 'edit-collection',
      payload: {
        collection,
      },
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/collections/${collection.id}`);
  };

  return (
    <Card
      className="overflow-hidden py-4 cursor-pointer shadow-lg hover:shadow-sm transition-all"
      style={generatedCardStyles}
      onClick={handleClick}
    >
      <CardContent className="p-4 py-1 space-y-14">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight overflow-hidden truncate">
            {collection.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="grid w-max space-y-2 py-2"
              align="end"
            >
              <DropdownMenuItem
                className="justify-start"
                onClick={handleEditCollection}
                asChild
              >
                <Button variant="ghost">Edit Collection Info</Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteCollection}
                className="text-destructive justify-start"
                asChild
              >
                <Button variant="ghost">Delete Collection</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
};

export default CollectionCard;

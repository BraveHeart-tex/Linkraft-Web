'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { TREE_VIEW_DEFAULT_ICON_SIZE } from '@/components/CollectionTreeNode';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import {
  useDeleteCollection,
  useUpdateCollection,
} from '@/features/collections/collection.api';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { isErrorApiResponse } from '@/lib/api/api.utils';
import { getCurrentTimestamp } from '@/lib/dateUtils';
import { updateItemInInfiniteQueryData } from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { showErrorToast } from '@/lib/toast';
import { cn, withStopPropagation } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { EllipsisIcon } from 'lucide-react';
import { NodeApi } from 'react-arborist';

interface CollectionTreeNodeActionsProps {
  isHovered: boolean;
  node: NodeApi<CollectionNode>;
}

const CollectionTreeNodeActions = ({
  isHovered,
  node,
}: CollectionTreeNodeActionsProps) => {
  const queryClient = useQueryClient();
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );

  // TODO: Handle the update of all bookmarks page data as well
  const { mutate: deleteCollection } = useDeleteCollection({
    async onMutate(variables) {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: QUERY_KEYS.collections.list(),
        }),
        queryClient.cancelQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
        }),
      ]);

      const previousCollections = queryClient.getQueryData<
        CollectionWithBookmarkCount[]
      >(QUERY_KEYS.collections.list());

      const previousBookmarks = queryClient.getQueryData<InfiniteBookmarksData>(
        QUERY_KEYS.bookmarks.list()
      );

      queryClient.setQueryData<CollectionWithBookmarkCount[]>(
        QUERY_KEYS.collections.list(),
        (prev) =>
          prev
            ? prev.filter(
                (collection) => collection.id !== variables.collectionId
              )
            : prev
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
    async onError(error, _variables, context) {
      queryClient.setQueryData(
        QUERY_KEYS.collections.list(),
        context?.previousCollections
      );
      queryClient.setQueryData(
        QUERY_KEYS.bookmarks.list(),
        context?.previousBookmarks
      );
      showErrorToast('An error occurred while deleting the collection', {
        description: isErrorApiResponse(error)
          ? error.message
          : 'An unknown error occurred',
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

  // TODO: Handle optimistic updates on all bookmarks and collection bookmarks etc
  const { mutate: renameCollection } = useUpdateCollection({
    async onMutate(variables) {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.collections.list(),
      });

      const previousCollections =
        queryClient.getQueryData<CollectionWithBookmarkCount[]>(
          QUERY_KEYS.collections.list()
        ) || [];

      queryClient.setQueryData<CollectionWithBookmarkCount[]>(
        QUERY_KEYS.collections.list(),
        (old) =>
          old
            ? old.map((oldCollection) => ({
                ...oldCollection,
                name:
                  oldCollection.id === variables.id
                    ? variables.name
                    : oldCollection.name,
              }))
            : old
      );

      return { previousCollections };
    },
    onError(error, _variables, context) {
      queryClient.setQueryData(
        QUERY_KEYS.collections.list(),
        context?.previousCollections
      );
      showErrorToast('An error occurred while renaming the collection', {
        description: isErrorApiResponse(error)
          ? error.message
          : 'An unknown error occurred',
      });
    },
    async onSettled() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collections.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
        }),
      ]);
    },
  });

  const handleDelete = withStopPropagation(() => {
    showConfirmDialog({
      title: 'Are your sure you want to delete this collection?',
      message: 'This action cannot be undone',
      primaryActionLabel: 'Delete',
      alertText:
        node.data.bookmarkCount > 0
          ? 'All the bookmarks inside the collection will be moved to trash'
          : '',
      onConfirm: () => {
        deleteCollection({ collectionId: node.data.id });
      },
    });
  });

  const handleRename = withStopPropagation(async () => {
    const editResult = await node.edit();
    if (!editResult.cancelled) {
      renameCollection({
        id: node.data.id,
        name: editResult.value,
      });
    }
  });

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={(e) => {
            node.select();
            e.stopPropagation();
          }}
          variant="ghost"
          size="icon"
          className={cn(
            'h-6 w-6 p-0 transition-opacity opacity-0 duration-200 ease-in-out right-0 absolute pointer-events-none',
            isHovered && 'opacity-100 pointer-events-auto',
            !node.isSelected && 'hover:bg-sidebar'
          )}
        >
          <EllipsisIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        // Keeps the focus on the node input on rename click
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem onClick={handleRename}>
          Create nested collection
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionTreeNodeActions;

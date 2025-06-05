'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { TREE_VIEW_DEFAULT_ICON_SIZE } from '@/components/CollectionTreeNode';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Separator } from '@/components/ui/Separator';
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
import {
  cn,
  ensureCollectionTitleLength,
  withStopPropagation,
} from '@/lib/utils';
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
    const { id, bookmarkCount } = node.data;

    const confirmAndDelete = () => deleteCollection({ collectionId: id });

    if (bookmarkCount) {
      showConfirmDialog({
        title: 'Are you sure you want to delete this collection?',
        message: 'This action cannot be undone',
        primaryActionLabel: 'Delete',
        alertText:
          bookmarkCount > 0
            ? 'All the bookmarks inside the collection will be moved to trash'
            : '',
        onConfirm: confirmAndDelete,
      });
    } else {
      confirmAndDelete();
    }
  });

  const handleRename = withStopPropagation(async () => {
    const editResult = await node.edit();
    if (editResult.cancelled) return;
    if (editResult.value.replaceAll(' ', '').length === 0) {
      node.reset();
      return;
    }

    renameCollection({
      id: node.data.id,
      name: ensureCollectionTitleLength(editResult.value),
    });
  });

  return (
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-max"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1.5 rounded-sm font-medium"
          onClick={handleRename}
        >
          Create nested collection
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1.5 rounded-sm font-medium"
          onClick={handleRename}
        >
          Rename
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive px-2 py-1.5 rounded-sm font-medium hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionTreeNodeActions;

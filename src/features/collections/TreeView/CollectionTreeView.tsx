'use client';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import CollectionDragLine from '@/features/collections/TreeView/CollectionDragLine';
import CollectionTreeItem from '@/features/collections/TreeView/CollectionTreeItem';
import { ROOT_ITEM_ID } from '@/features/collections/TreeView/constants';
import {
  CollectionNode,
  CollectionNodeInstance,
} from '@/features/collections/TreeView/types';
import { useCollectionTreeStore } from '@/features/collections/TreeView/useCollectionTreeStore';
import { getDescendantIds } from '@/features/collections/TreeView/utils';
import {
  useCollections,
  useDeleteCollection,
  useRenameCollection,
} from '@/features/collections/collection.api';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { isErrorApiResponse } from '@/lib/api/api.utils';
import { getCurrentTimestamp } from '@/lib/dateUtils';
import { updateItemInInfiniteQueryData } from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { showErrorToast } from '@/lib/toast';
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  removeItemsFromParents,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const CollectionTreeView = () => {
  const initialize = useCollectionTreeStore((state) => state.initialize);
  const nodes = useCollectionTreeStore((state) => state.nodes);
  const { data: collections } = useCollections();

  useEffect(() => {
    if (collections) {
      initialize(collections);
    }
  }, [collections, initialize]);

  if (Object.keys(nodes).length === 0) return null;

  return <CollectionsTree />;
};

const CollectionsTree = () => {
  const queryClient = useQueryClient();
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );

  const nodes = useCollectionTreeStore((state) => state.nodes);

  const tree = useTree<CollectionNode>({
    rootItemId: ROOT_ITEM_ID,
    getItemName: (item) => item.getItemData().name,
    isItemFolder: () => true,
    canReorder: true,
    onDrop: (items, target) => {
      alert(
        `Dropped ${items.map((item) =>
          item.getId()
        )} on ${target.item.getId()}, ${JSON.stringify(target)}`
      );
    },
    onRename: (item, value) => {
      renameCollection({
        id: item.getId(),
        name: value,
      });
    },
    indent: 20,
    dataLoader: {
      getItem: (itemId) => nodes[itemId],
      getChildren: (itemId) => nodes[itemId].children,
    },
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
      keyboardDragAndDropFeature,
      renamingFeature,
    ],
  });

  const { mutate: renameCollection } = useRenameCollection({
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
        (prev) => {
          if (!prev) return prev;
          const descendantIds = getDescendantIds(prev, variables.collectionId);
          return prev.filter((collection) => !descendantIds.has(collection.id));
        }
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

  const handleDelete = (item: CollectionNodeInstance) => {
    const { bookmarkCount, id } = item.getItemData();
    const confirmAndDelete = () => {
      removeItemsFromParents([item], (parentItem, newChildren) => {
        parentItem.getItemData().children = newChildren;
      });
      deleteCollection({ collectionId: id });
    };

    if (bookmarkCount) {
      showConfirmDialog({
        title: 'Are you sure you want to delete this collection?',
        message: 'This action cannot be undone',
        primaryActionLabel: 'Delete',
        alertText:
          'All the bookmarks inside the collection will be moved to trash',
        onConfirm: confirmAndDelete,
      });
    } else {
      confirmAndDelete();
    }
  };

  return (
    <div className="h-full w-full flex-1 max-h-max">
      {!Object.keys(nodes).length ? (
        <p className="text-xs px-4 py-2">No collections found</p>
      ) : (
        <div {...tree.getContainerProps()} className="max-w-[18.75rem]">
          {tree.getItems().map((item) => (
            <CollectionTreeItem
              item={item}
              key={item.getId()}
              onDelete={handleDelete}
            />
          ))}
          <CollectionDragLine draglineStyle={tree.getDragLineStyle()} />
        </div>
      )}
    </div>
  );
};

export default CollectionTreeView;

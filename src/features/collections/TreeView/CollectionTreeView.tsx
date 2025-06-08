'use client';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  keyboardDragAndDropFeature,
  renamingFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { useMemo } from 'react';

import CollectionDragLine from '@/features/collections/TreeView/CollectionDragLine';
import CollectionTreeItem from '@/features/collections/TreeView/CollectionTreeItem';
import { ROOT_ITEM_ID } from '@/features/collections/TreeView/constants';
import { CollectionNode } from '@/features/collections/TreeView/types';
import { mapCollectionsToNodes } from '@/features/collections/TreeView/utils';
import {
  useCollections,
  useRenameCollection,
} from '@/features/collections/collection.api';
import { isErrorApiResponse } from '@/lib/api/api.utils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';

interface CollectionTreeViewProps {
  collections: CollectionWithBookmarkCount[];
}

const CollectionTreeView = ({
  collections: initialCollections,
}: CollectionTreeViewProps) => {
  const queryClient = useQueryClient();
  const { data: collections } = useCollections({
    initialData: initialCollections,
  });

  const mappedCollections: Record<string, CollectionNode> = useMemo(() => {
    if (!collections) return {};
    return mapCollectionsToNodes(collections);
  }, [collections]);

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
      getItem: (itemId) => mappedCollections[itemId],
      getChildren: (itemId) =>
        mappedCollections[itemId].children.map((child) => child.id),
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

      tree.rebuildTree();

      return { previousCollections };
    },
    onError(error, _variables, context) {
      queryClient.setQueryData(
        QUERY_KEYS.collections.list(),
        context?.previousCollections
      );

      tree.rebuildTree();
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

  return (
    <div className="h-full w-full flex-1 max-h-max">
      <div {...tree.getContainerProps()} className="max-w-[18.75rem]">
        {tree.getItems().map((item) => (
          <CollectionTreeItem item={item} key={item.getId()} />
        ))}
        <CollectionDragLine draglineStyle={tree.getDragLineStyle()} />
      </div>
    </div>
  );
};

export default CollectionTreeView;

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
import { CollectionNode } from '@/features/collections/TreeView/types';
import { mapCollectionsToNodes } from '@/features/collections/TreeView/utils';

interface CollectionTreeViewProps {
  collections: CollectionWithBookmarkCount[];
}

const CollectionTreeView = ({ collections }: CollectionTreeViewProps) => {
  const mappedCollections = useMemo(() => {
    return mapCollectionsToNodes(collections);
  }, [collections]);

  const tree = useTree<CollectionNode>({
    rootItemId: 'root',
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
      alert(`Renamed ${item.getItemName()} to ${value}`);
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

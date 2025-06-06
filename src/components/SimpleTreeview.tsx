'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { cn } from '@/lib/utils';
import {
  dragAndDropFeature,
  hotkeysCoreFeature,
  ItemInstance,
  keyboardDragAndDropFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { ChevronRightIcon } from 'lucide-react';
import { useMemo } from 'react';

export function mapCollectionsToNodes(
  collections: CollectionWithBookmarkCount[]
): Record<string, CollectionNode> {
  const nodeMap: Record<string, CollectionNode> = {};
  const childMap: Record<string, string[]> = {};

  const rootChildren: string[] = [];

  for (const collection of collections) {
    nodeMap[collection.id] = {
      id: collection.id,
      name: collection.name,
      bookmarkCount: collection.bookmarkCount,
      children: [],
    };

    if (collection.parentId) {
      if (!childMap[collection.parentId]) {
        childMap[collection.parentId] = [];
      }
      childMap[collection.parentId].push(collection.id);
    } else {
      rootChildren.push(collection.id);
    }
  }

  // Step 2: Attach children to their parents
  for (const [parentId, childIds] of Object.entries(childMap)) {
    const parentNode = nodeMap[parentId];
    if (parentNode) {
      parentNode.children = childIds.map((childId) => nodeMap[childId]);
    }
  }

  nodeMap['root'] = {
    id: 'root',
    name: 'Root',
    bookmarkCount: 0,
    children: rootChildren.map((childId) => nodeMap[childId]),
  };

  return nodeMap;
}

const SimpleTreeView = ({
  collections,
}: {
  collections: CollectionWithBookmarkCount[];
}) => {
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
    ],
  });

  return (
    <div className="h-full w-full flex-1 overflow-auto max-h-max">
      <div {...tree.getContainerProps()} className="max-w-[18.75rem]">
        {tree.getItems().map((item) => (
          <SimpleTreeItem item={item} key={item.getId()} />
        ))}
        <div style={tree.getDragLineStyle()} className="dragline" />
      </div>
    </div>
  );
};

const SimpleTreeItem = ({ item }: { item: ItemInstance<CollectionNode> }) => {
  const hasChildren = item.getChildren().length > 0;

  return (
    <button
      {...item.getProps()}
      style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
      className="flex bg-transparent border-0 border-none w-full pl-1 rounded-md rounded-r-none"
    >
      <div
        className={cn(
          'relative w-full text-left bg-transparent py-1 px-2 transition-colors cursor-pointer hover:bg-muted rounded-md rounded-r-none font-medium',
          item.isSelected() && 'bg-muted',
          item.isDragTarget() &&
            'bg-primary/50 border-muted text-primary-foreground',
          !hasChildren && 'pl-6'
        )}
      >
        {hasChildren ? (
          <ChevronRightIcon
            className={cn(
              'w-3 inline-block z-10 mr-1 transition-transform duration-100 ease-in-out',
              item.isExpanded() && 'rotate-90'
            )}
          />
        ) : null}
        {item.getItemName()}

        {item.isSelected() ? (
          <span className="absolute top-[5px] left-[-2px] h-4 w-1 bg-primary rounded-full" />
        ) : null}
      </div>
    </button>
  );
};

export default SimpleTreeView;

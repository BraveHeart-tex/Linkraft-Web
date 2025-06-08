import {
  Collection,
  CollectionWithBookmarkCount,
} from '@/features/collections/collection.types';
import { ROOT_ITEM_ID } from '@/features/collections/TreeView/constants';
import { CollectionNode } from '@/features/collections/TreeView/types';

export const mapCollectionsToNodes = (
  collections: CollectionWithBookmarkCount[]
): Record<string, CollectionNode> => {
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

  nodeMap[ROOT_ITEM_ID] = {
    id: ROOT_ITEM_ID,
    name: 'Root',
    bookmarkCount: 0,
    children: rootChildren,
  };

  return nodeMap;
};

export function getDescendantIds(
  collections: Collection[],
  targetId: string
): Set<string> {
  const descendants = new Set<string>();
  const stack = [targetId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    descendants.add(currentId);

    collections.forEach((c) => {
      if (c.parentId === currentId && !descendants.has(c.id)) {
        stack.push(c.id);
      }
    });
  }

  return descendants;
}

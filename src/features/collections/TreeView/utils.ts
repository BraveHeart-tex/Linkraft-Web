import {
  Collection,
  CollectionWithBookmarkCount,
} from '@/features/collections/collection.types';
import { ROOT_ITEM_ID } from '@/features/collections/TreeView/constants';
import { CollectionNode } from '@/features/collections/TreeView/types';

export const mapCollectionsToNodes = (
  collections: CollectionWithBookmarkCount[]
): Record<string, CollectionNode> => {
  const nodeMap: Record<string, CollectionNode> = {
    [ROOT_ITEM_ID]: {
      id: ROOT_ITEM_ID,
      name: 'Root',
      bookmarkCount: 0,
      children: [],
    },
  };

  for (const collection of collections) {
    nodeMap[collection.id] = {
      id: collection.id,
      name: collection.name,
      bookmarkCount: collection.bookmarkCount,
      children: [],
    };
  }

  for (const collection of collections) {
    const parentId = collection.parentId ?? ROOT_ITEM_ID;
    nodeMap[parentId].children.push(collection.id);
  }

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

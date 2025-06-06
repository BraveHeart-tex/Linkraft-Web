import { CollectionNode } from '@/components/CollectionsTreeView';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';

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
};

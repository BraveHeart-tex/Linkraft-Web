'use client';
import CollectionTreeNode from '@/components/CollectionTreeNode';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useCollections } from '@/features/collections/collection.api';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import {
  mapCollectionsToTree,
  sortCollectionByDisplayOrder,
} from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { CursorProps, MoveHandler, Tree } from 'react-arborist';

export interface CollectionNode {
  id: string;
  name: string;
  bookmarkCount: number;
  children: CollectionNode[];
}

interface CollectionsTreeViewProps {
  initialCollections: CollectionWithBookmarkCount[];
}

const CollectionsTreeView = ({
  initialCollections,
}: CollectionsTreeViewProps) => {
  const queryClient = useQueryClient();
  const {
    data: collections,
    isPending,
    error,
  } = useCollections({ initialData: initialCollections });

  const collectionsTree: CollectionNode[] = useMemo(() => {
    if (!collections) return [];
    return mapCollectionsToTree(collections);
  }, [collections]);

  const onMove: MoveHandler<CollectionNode> = ({
    dragNodes,
    parentId: targetParentId,
    index: targetIndex,
  }) => {
    const draggedNode = dragNodes[0];
    const originalParentId = draggedNode.parent?.id ?? null;

    queryClient.setQueryData<CollectionWithBookmarkCount[]>(
      QUERY_KEYS.collections.list(),
      (prev) => {
        if (!prev) return prev;

        const isSameParent = originalParentId === targetParentId;

        const getSortedSiblings = (
          items: CollectionWithBookmarkCount[],
          pid: string | null
        ) =>
          items
            .filter((item) => item.parentId === pid)
            .sort(sortCollectionByDisplayOrder);

        if (isSameParent) {
          const siblings = getSortedSiblings(prev, targetParentId);

          // Remove dragged node
          const withoutDragged = siblings.filter(
            (s) => s.id !== draggedNode.id
          );

          // Insert it at the new index
          const newSiblings = [
            ...withoutDragged.slice(0, targetIndex),
            { ...draggedNode, parentId: targetParentId },
            ...withoutDragged.slice(targetIndex),
          ];

          // Map new displayOrders into original collection list
          const updated = prev.map((item) => {
            const updatedSiblingIndex = newSiblings.findIndex(
              (s) => s.id === item.id
            );
            if (updatedSiblingIndex !== -1) {
              return {
                ...item,
                displayOrder: updatedSiblingIndex,
              };
            }
            return item;
          });

          return updated.sort(sortCollectionByDisplayOrder);
        } else {
          const targetSiblings = getSortedSiblings(prev, targetParentId);

          const newTargetSiblings = [
            ...targetSiblings.slice(0, targetIndex),
            { ...draggedNode, parentId: targetParentId },
            ...targetSiblings.slice(targetIndex),
          ];

          return prev
            .map((item) => {
              const newIndex = newTargetSiblings.findIndex(
                (s) => s.id === item.id
              );

              // Update affected siblings (including dragged node)
              if (newIndex !== -1) {
                return {
                  ...item,
                  parentId: targetParentId,
                  displayOrder: newIndex,
                };
              }

              // Leave all other nodes unchanged
              return item;
            })
            .sort(sortCollectionByDisplayOrder);
        }
      }
    );
  };

  if (error) {
    return (
      <p className="text-sm py-2 px-4 text-destructive">
        An error occurred while fetching collections
      </p>
    );
  }

  return (
    <div className="flex h-screen flex-1 min-w-full">
      {isPending && <LoadingSpinner className="py-2 px-4" />}
      {!isPending && collections?.length === 0 ? (
        <p className="text-sm py-2 px-4">No collections found</p>
      ) : (
        <ResponsiveContainer>
          {(dimensions) => (
            <Tree
              {...dimensions}
              onMove={onMove}
              data={collectionsTree}
              renderCursor={Cursor}
              indent={10}
              rowHeight={30}
            >
              {CollectionTreeNode}
            </Tree>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

function Cursor({ top, left }: CursorProps) {
  return (
    <div
      className="w-full h-0 border-t-2 border-t-primary absolute"
      style={{ top, left }}
    ></div>
  );
}

export default CollectionsTreeView;

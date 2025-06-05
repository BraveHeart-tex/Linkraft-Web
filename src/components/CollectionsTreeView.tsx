'use client';
import CollectionTreeNode from '@/components/CollectionTreeNode';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useCollections } from '@/features/collections/collection.api';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { mapCollectionsToTree } from '@/lib/utils';
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
    parentId,
    index,
  }) => {
    const draggedNode = dragNodes[0];
    const originalParentNode = draggedNode.parent;
    const originalParentId = originalParentNode ? originalParentNode.id : null;

    console.log('index', index);

    if (originalParentId === parentId) {
      console.log('Reordering within the same parent');
    } else {
      console.log('Moving to a new parent');
      console.log('originalParentId', originalParentId);
      console.log('new parentId', parentId);
    }
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

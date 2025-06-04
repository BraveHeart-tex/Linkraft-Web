'use client';
import CollectionTreeNode from '@/components/CollectionTreeNode';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useCollections } from '@/features/collections/collection.api';
import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { mapCollectionsToTree } from '@/lib/utils';
import { useMemo } from 'react';
import { Tree } from 'react-arborist';

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
              data={collectionsTree}
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

export default CollectionsTreeView;

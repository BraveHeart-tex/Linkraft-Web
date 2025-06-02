'use client';
import CollectionTreeNode from '@/components/CollectionTreeNode';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Tree } from 'react-arborist';

export interface CollectionNode {
  id: string;
  name: string;
  bookmarkCount: number;
  children: CollectionNode[];
}

const initialCollections: CollectionNode[] = [
  {
    id: '1',
    name: 'Unread',
    children: [],
    bookmarkCount: 12,
  },
  {
    id: '2',
    name: 'Threads',
    children: [],
    bookmarkCount: 12,
  },
  {
    id: '3',
    name: 'Chat Rooms',
    children: [
      {
        id: 'c1',
        name: 'General',
        children: [],
        bookmarkCount: 12,
      },
      {
        id: 'c2',
        name: 'Random',
        children: [],
        bookmarkCount: 12,
      },
      {
        id: 'c3',
        name: 'Open Source Projects',
        children: [],
        bookmarkCount: 12,
      },
    ],
    bookmarkCount: 12,
  },
  {
    id: '4',
    name: 'Direct Messages',
    children: [
      {
        id: 'd1',
        name: 'Alice',
        children: [],
        bookmarkCount: 12,
      },
      {
        id: 'd2',
        name: 'Bob',
        children: [],
        bookmarkCount: 12,
      },
      {
        id: 'd3',
        name: 'Charlie',
        children: [],
        bookmarkCount: 12,
      },
    ],
    bookmarkCount: 12,
  },
];

const CollectionsTreeView = () => {
  return (
    <div className="flex h-screen flex-1 min-w-full">
      <ResponsiveContainer>
        {(dimensions) => (
          <Tree
            {...dimensions}
            initialData={initialCollections}
            indent={10}
            rowHeight={30}
          >
            {CollectionTreeNode}
          </Tree>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default CollectionsTreeView;

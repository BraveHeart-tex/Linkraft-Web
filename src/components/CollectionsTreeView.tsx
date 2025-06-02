'use client';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, FolderIcon } from 'lucide-react';
import { NodeRendererProps, Tree } from 'react-arborist';

interface Node {
  id: string;
  name: string;
  bookmarkCount: number;
  children: Node[];
}

const initialCollections: Node[] = [
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
            padding={15}
            rowHeight={30}
          >
            {TreeNode}
          </Tree>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const TreeNode = ({ node, style, dragHandle }: NodeRendererProps<Node>) => {
  return (
    <div
      ref={dragHandle}
      style={style}
      className={cn(
        'transition-colors relative w-full flex items-center gap-2 cursor-pointer h-full! overflow-hidden truncate text-ellipsis text-sidebar-foreground/90 font-medium',
        node.state,
        node.isSelected &&
          'bg-primary text-primary-foreground hover:bg-primary',
        !node.isSelected && 'hover:bg-sidebar-foreground/10'
      )}
    >
      <Button
        className="size-3 ml-1 rounded-full items-center justify-center"
        variant="ghost"
        onClick={() => node.isInternal && node.toggle()}
      >
        <ChevronRightIcon
          size={12}
          className={cn(
            'transition-all',
            node.isInternal && node.isOpen && 'rotate-90'
          )}
        />
      </Button>
      <FolderIcon size={14} />
      <span className="">{node.data.name}</span>
    </div>
  );
};
export default CollectionsTreeView;

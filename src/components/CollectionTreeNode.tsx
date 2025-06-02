'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import {
  ChevronRightIcon,
  EllipsisIcon,
  FolderIcon,
  FolderOpenIcon,
} from 'lucide-react';
import { useState } from 'react';
import { NodeRendererProps } from 'react-arborist';

const TREE_VIEW_DEFAULT_ICON_SIZE = 18;
const TREE_VIEW_SECONDARY_ICON_SIZE = 16;

const CollectionTreeNode = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<CollectionNode>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={dragHandle}
      style={style}
      className={cn(
        'relative w-full flex items-center justify-between gap-2 cursor-pointer h-full! overflow-hidden truncate text-ellipsis text-sidebar-foreground/90 font-medium',
        node.isSelected &&
          'bg-primary text-primary-foreground hover:bg-primary',
        !node.isSelected && 'hover:bg-sidebar-foreground/10'
      )}
      onClick={() => node.isInternal && node.toggle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full flex items-center gap-2 flex-1 min-w-0">
        <ChevronRightIcon
          size={TREE_VIEW_SECONDARY_ICON_SIZE}
          className={cn(
            'shrink-0 ml-1 rounded-full transition-all',
            node.isInternal && node.isOpen && 'rotate-90'
          )}
        />
        {node.isOpen ? (
          <FolderOpenIcon
            size={TREE_VIEW_DEFAULT_ICON_SIZE}
            className="shrink-0"
          />
        ) : (
          <FolderIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} className="shrink-0" />
        )}
        <span className="truncate">{node.data.name}</span>
      </div>

      <div className="flex justify-center items-center gap-2 relative min-w-10">
        <span
          className={cn(
            'text-[0.8rem] opacity-100 mr-1 text-sidebar-foreground/50 font-medium transition-opacity duration-200 ease-in-out absolute right-0',
            node.isSelected && 'text-primary-foreground',
            isHovered && 'opacity-0 pointer-none:'
          )}
        >
          {node.data.bookmarkCount}
        </span>
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => {
                node.select();
                e.stopPropagation();
              }}
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6 p-0 transition-opacity opacity-0 duration-200 ease-in-out right-0 absolute pointer-events-none',
                isHovered && 'opacity-100 pointer-events-auto',
                !node.isSelected && 'hover:bg-sidebar'
              )}
            >
              <EllipsisIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem onSelect={() => console.log('Edit', node.data)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log('Delete', node.data)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CollectionTreeNode;

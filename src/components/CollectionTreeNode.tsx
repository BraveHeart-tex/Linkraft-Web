'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import CollectionTreeNodeActions from '@/components/CollectionTreeNodeActions';
import CollectionTreeNodeInput from '@/components/CollectionTreeNodeInput';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useState } from 'react';
import { NodeRendererProps } from 'react-arborist';

export const TREE_VIEW_DEFAULT_ICON_SIZE = 18;
export const TREE_VIEW_SECONDARY_ICON_SIZE = 16;

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
      tabIndex={-1}
      onClick={() => node.isInternal && node.toggle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full flex items-center gap-1 flex-1 min-w-0">
        <div
          style={{
            width: `${TREE_VIEW_SECONDARY_ICON_SIZE}px`,
            height: `${TREE_VIEW_SECONDARY_ICON_SIZE}px`,
          }}
        >
          {node.data?.children?.length > 0 ? (
            <ChevronRightIcon
              size={TREE_VIEW_SECONDARY_ICON_SIZE}
              className={cn(
                'shrink-0 rounded-full transition-all',
                node.isInternal && node.isOpen && 'rotate-90'
              )}
            />
          ) : null}
        </div>
        {node.data?.children?.length && node.isOpen ? (
          <FolderOpenIcon
            size={TREE_VIEW_DEFAULT_ICON_SIZE}
            className="shrink-0"
          />
        ) : (
          <FolderIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} className="shrink-0" />
        )}
        {node.isEditing ? (
          <CollectionTreeNodeInput node={node} />
        ) : (
          <span className="truncate text-sm">{node.data.name}</span>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 relative min-w-10">
        <span
          className={cn(
            'text-sm opacity-100 mr-1 text-sidebar-foreground/50 font-medium transition-opacity duration-200 ease-in-out absolute right-0',
            node.isSelected && 'text-primary-foreground',
            isHovered && 'opacity-0 pointer-none:'
          )}
        >
          {node.data.bookmarkCount}
        </span>
        <CollectionTreeNodeActions isHovered={isHovered} node={node} />
      </div>
    </div>
  );
};

export default CollectionTreeNode;

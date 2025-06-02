'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { cn, withStopPropagation } from '@/lib/utils';
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
  tree,
}: NodeRendererProps<CollectionNode>) => {
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = withStopPropagation(() => {
    showConfirmDialog({
      title: 'Are your sure you want to delete this collection?',
      message: 'This action cannot be undone',
      primaryActionLabel: 'Delete',
      alertText:
        node.data.bookmarkCount > 0
          ? 'All the bookmarks inside the collection will be moved to trash'
          : '',
      onConfirm: () => {
        tree.delete(node);
      },
    });
  });

  const handleRename = withStopPropagation(() => {});

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
        <span className="truncate text-sm">{node.data.name}</span>
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
          <DropdownMenuContent align="start" side="bottom">
            <DropdownMenuItem onClick={handleRename}>
              Create nested collection
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CollectionTreeNode;

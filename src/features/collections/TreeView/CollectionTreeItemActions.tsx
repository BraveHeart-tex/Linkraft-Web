'use client';
import { CollectionNode } from '@/components/CollectionsTreeView';
import { TREE_VIEW_DEFAULT_ICON_SIZE } from '@/components/CollectionTreeNode';
import { Button, buttonVariants } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { Separator } from '@/components/ui/Separator';
import { cn, withStopPropagation } from '@/lib/utils';
import { ItemInstance } from '@headless-tree/core';
import { EllipsisIcon } from 'lucide-react';
import { JSX } from 'react';

interface CollectionTreeItemActionsProps {
  item: ItemInstance<CollectionNode>;
  isHovering: boolean;
}

const CollectionTreeItemActions = ({
  item,
  isHovering,
}: CollectionTreeItemActionsProps) => {
  const bookmarkCount = item.getItemData().bookmarkCount;
  const handleRename = withStopPropagation(() => {
    item.startRenaming();
  });

  const renderTriggerLabel = (): JSX.Element => {
    const hasBookmarks = bookmarkCount > 0;

    if (isHovering) {
      return <EllipsisIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} />;
    }

    if (hasBookmarks) {
      return <span className="text-xs">{bookmarkCount}</span>;
    }

    // No label if not hovering and no bookmarks
    return <></>;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={cn(
            buttonVariants({
              variant: 'ghost',
              size: 'icon',
              className: 'h-6 w-6 p-0 hover:bg-sidebar!',
            })
          )}
        >
          {renderTriggerLabel()}
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        className="w-max"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1.5 rounded-sm font-medium"
        >
          Create nested collection
        </Button>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1.5 rounded-sm font-medium"
          onClick={handleRename}
        >
          Rename
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive px-2 py-1.5 rounded-sm font-medium hover:bg-destructive hover:text-destructive-foreground"
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default CollectionTreeItemActions;

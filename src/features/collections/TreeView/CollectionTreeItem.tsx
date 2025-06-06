'use client';
import CollectionRenameInput from '@/features/collections/TreeView/CollectionRenameInput';
import CollectionTreeItemActions from '@/features/collections/TreeView/CollectionTreeItemActions';
import { TREE_VIEW_DEFAULT_ICON_SIZE } from '@/features/collections/TreeView/constants';
import { CollectionNodeInstance } from '@/features/collections/TreeView/types';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from 'lucide-react';
import { useState } from 'react';

const CollectionTreeItem = ({ item }: { item: CollectionNodeInstance }) => {
  const [isHovering, setIsHovering] = useState(false);
  const hasChildren = item.getChildren().length > 0;

  return (
    <button
      {...item.getProps()}
      style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
      className={cn(
        'flex bg-transparent border-0 border-none w-full pl-1 rounded-md rounded-r-none hover:bg-accent',
        item.isFocused() && 'bg-accent outline-primary',
        item.isSelected() && 'bg-accent',
        item.isDragTarget() && 'bg-accent border-muted text-accent-foreground'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className={cn(
          'relative w-full text-left bg-transparent py-1 px-2 transition-colors cursor-pointer rounded-md rounded-r-none font-medium flex items-center',
          !hasChildren && 'pl-6'
        )}
      >
        {hasChildren ? (
          <ChevronRightIcon
            className={cn(
              'w-3 inline-block z-10 mr-1 transition-transform duration-100 ease-in-out',
              item.isExpanded() && 'rotate-90'
            )}
          />
        ) : null}

        <div className="flex items-center flex-1 justify-between">
          {item.isRenaming() ? (
            <CollectionRenameInput item={item} />
          ) : (
            <>
              <div className="flex items-center gap-1">
                {item.isExpanded() ? (
                  <FolderOpenIcon
                    size={TREE_VIEW_DEFAULT_ICON_SIZE}
                    className="fill-yellow-500 stroke-yellow-700 dark:fill-yellow-600 dark:stroke-yellow-400"
                  />
                ) : (
                  <FolderIcon size={TREE_VIEW_DEFAULT_ICON_SIZE} />
                )}
                <span>{item.getItemName()}</span>
              </div>
              <CollectionTreeItemActions item={item} isHovering={isHovering} />
            </>
          )}
        </div>
      </div>
    </button>
  );
};

export default CollectionTreeItem;

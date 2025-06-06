'use client';
import CollectionTreeItemActions from '@/features/collections/TreeView/CollectionTreeItemActions';
import { CollectionNodeInstance } from '@/features/collections/TreeView/types';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

const CollectionTreeItem = ({ item }: { item: CollectionNodeInstance }) => {
  const [isHovering, setIsHovering] = useState(false);
  const hasChildren = item.getChildren().length > 0;

  return (
    <button
      {...item.getProps()}
      style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
      className="flex bg-transparent border-0 border-none w-full pl-1 rounded-md rounded-r-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {}
      <div
        className={cn(
          'relative w-full text-left bg-transparent py-1 px-2 transition-colors cursor-pointer hover:bg-muted rounded-md rounded-r-none font-medium flex items-center',
          item.isSelected() && 'bg-muted',
          item.isDragTarget() &&
            'bg-accent border-muted text-accent-foreground',
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
          <span>{item.getItemName()}</span>
          <CollectionTreeItemActions item={item} isHovering={isHovering} />
        </div>

        {item.isSelected() ? (
          <span className="absolute left-[-2px] top-1/2 -translate-y-1/2 h-4 w-1 bg-primary rounded-full" />
        ) : null}
      </div>
    </button>
  );
};

export default CollectionTreeItem;

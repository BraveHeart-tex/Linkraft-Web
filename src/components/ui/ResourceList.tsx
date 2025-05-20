'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { useResponsiveColumns } from '@/hooks/useResponsiveColumns';
import { Nullable } from '@/lib/common.types';
import { cn } from '@/lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AlertCircle, BoxIcon, RefreshCw } from 'lucide-react';
import React, { useEffect, useMemo, useRef } from 'react';

type EmptyAction =
  | {
      element: React.ReactNode;
      label?: never;
      onClick?: never;
      disabled?: never;
    }
  | {
      label: string;
      onClick: () => void;
      disabled?: boolean;
    };

function isCustomAction(
  action?: EmptyAction
): action is { element: React.ReactNode } {
  if (!action) return false;
  return 'element' in action;
}

const VIRTUAL_ROW_GAP_PX = 16 as const;

export interface ResourceListProps<T> {
  data?: T[];
  isLoading?: boolean;
  error?: Nullable<Error | string>;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: EmptyAction;
  errorTitle?: string;
  containerClasses?: string;
  className?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  estimateSize?: number;
  listParentClasses?: string;
}

const ResourceList = <T,>({
  data,
  isLoading = false,
  error = null,
  onRetry,
  renderItem,
  renderSkeleton,
  emptyMessage = 'No items found',
  containerClasses,
  emptyIcon,
  emptyAction,
  errorTitle = 'Error loading items',
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  estimateSize = 220,
  listParentClasses,
}: ResourceListProps<T>) => {
  const itemsPerRow = useResponsiveColumns();
  const rows = useMemo(() => {
    if (!data?.length) return [];
    const chunked: T[][] = [];
    for (let i = 0; i < data.length; i += itemsPerRow) {
      chunked.push(data.slice(i, i + itemsPerRow));
    }
    return chunked;
  }, [data, itemsPerRow]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize + VIRTUAL_ROW_GAP_PX,
    overscan: 3,
  });

  const items = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!data?.length) return;

    const lastRow = items[items.length - 1];
    if (!lastRow) return;
    const lastIndex = lastRow.index * itemsPerRow + itemsPerRow - 1;
    if (lastIndex >= data.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [
    items,
    data?.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    itemsPerRow,
  ]);

  if (isLoading) {
    return (
      <div className={containerClasses}>
        {renderSkeleton ? (
          Array.from({ length: 3 }, (_, index) => (
            <React.Fragment key={`skeleton-${index}`}>
              {renderSkeleton()}
            </React.Fragment>
          ))
        ) : (
          // Default skeleton
          <div className="col-span-full flex justify-center p-8">
            <div className="animate-pulse flex space-x-2 items-center">
              <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
              <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === 'string'
        ? error
        : error.message || 'Something went wrong';

    return (
      <Card className="border-destructive/40 w-full max-w-xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="font-medium text-destructive">{errorTitle}</h3>
          <p className="text-sm text-muted-foreground w-full text-center">
            {errorMessage}
          </p>
          {onRetry && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onRetry}
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry
              </Button>
            </CardFooter>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-8 text-center border rounded-lg bg-muted/10 max-w-xl mx-auto">
        <div className="mb-3 flex justify-center">
          {emptyIcon ? (
            emptyIcon
          ) : (
            <BoxIcon className="h-10 w-10 stroke-muted-foreground" />
          )}
        </div>
        <p className="text-muted-foreground">{emptyMessage}</p>
        {isCustomAction(emptyAction) ? (
          emptyAction.element
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={emptyAction?.onClick}
            disabled={emptyAction?.disabled}
          >
            {emptyAction?.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        'relative overflow-auto h-[calc(100vh-180px)]',
        listParentClasses
      )}
    >
      <div
        suppressHydrationWarning
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {items.map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: '100%',
                paddingBottom: VIRTUAL_ROW_GAP_PX,
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {row.map((row) => renderItem(row, virtualRow.index))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceList;

'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export type ResourceListProps<T> = {
  data?: T[];
  isLoading?: boolean;
  error?: Error | string | null;
  onRetry?: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
  };
  errorTitle?: string;
  containerClasses?: string;
  className?: string;
  children?: React.ReactNode;
};

// Main component
const ResourceList = <T,>({
  data,
  isLoading = false,
  error = null,
  onRetry,
  renderItem,
  renderSkeleton,
  keyExtractor = (_, index) => index.toString(),
  emptyMessage = 'No items found',
  containerClasses,
  emptyIcon,
  emptyAction,
  errorTitle = 'Error loading items',
  children,
}: ResourceListProps<T>) => {
  if (isLoading) {
    return (
      <div className={containerClasses}>
        {renderSkeleton ? (
          // Custom skeleton
          Array.from({ length: 3 }).map((_, index) => (
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
        {emptyIcon && (
          <div className="mb-3 flex justify-center">{emptyIcon}</div>
        )}
        <p className="text-muted-foreground">{emptyMessage}</p>
        {emptyAction && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={emptyAction.onClick}
            disabled={emptyAction?.isDisabled}
          >
            {emptyAction.label}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {data.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
      {children}
    </div>
  );
};

export default ResourceList;

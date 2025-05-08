'use client';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import ResourceList from '@/components/ui/ResourceList';
import { useSelection } from '@/context/SelectionContext';
import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { filterInfiniteBookmarks } from '@/features/bookmarks/bookmark.utils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { ApiError } from 'next/dist/server/api-utils';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useBulkDeleteBookmarks, useTrashedBookmarks } from '../bookmark.api';
import BookmarkCard from '../BookmarkCard';
import BookmarkCardSkeleton from '../BookmarkCardSkeleton';

const TrashedBookmarkList = () => {
  const queryClient = useQueryClient();
  const { dispatch, state } = useSelection();
  const { mutate: bulkDeleteBookmarks, isPending: isBulkDeletingBookmarks } =
    useBulkDeleteBookmarks({
      onMutate(variables) {
        const previousTrashedBookmarks =
          queryClient.getQueryData<InfiniteBookmarksData>(
            QUERY_KEYS.bookmarks.trashed()
          );

        const toastId = showSuccessToast(
          `Bookmark${state.selectedIds.size > 1 ? 's' : ''} deleted successfully`
        );

        if (!previousTrashedBookmarks) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.trashed(),
          (old) =>
            old
              ? filterInfiniteBookmarks(
                  old,
                  (bookmark) => !variables.bookmarkIds.includes(bookmark.id)
                )
              : old
        );

        dispatch({ type: 'TOGGLE_SELECT_MODE' });

        return { previousTrashedBookmarks, toastId };
      },
      onError(error, _variables, context) {
        queryClient.setQueryData(
          QUERY_KEYS.bookmarks.trashed(),
          context?.previousTrashedBookmarks
        );
        showErrorToast(
          `An error occurred while deleting the bookmark${state.selectedIds.size > 1 ? 's' : ''}`,
          {
            description: (error as ApiError).message,
            id: context?.toastId,
          }
        );
      },
      async onSettled() {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.trashed(),
        });
      },
    });
  const showConfirmDialog = useConfirmDialogStore((s) => s.showConfirmDialog);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
    isRefetching,
  } = useTrashedBookmarks();
  const allBookmarks = useMemo(() => {
    return data?.pages.flatMap((page) => page.bookmarks) ?? [];
  }, [data]);

  const { inView, ref } = useInView({
    rootMargin: '100px 0px 100px 0px',
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  const handleCheckedChange = (checked: boolean) => {
    if (!data) return;

    if (checked) {
      dispatch({
        type: 'SELECT_ALL',
        ids: data.pages.flatMap((page) => page.bookmarks.map((b) => b.id)),
      });
    } else {
      dispatch({ type: 'DESELECT_ALL' });
    }
  };

  const handleDeleteSelected = () => {
    if (state.selectedIds.size === 0) return;
    showConfirmDialog({
      title: `Are you sure you want to permanently ${state.selectedIds.size} bookmark${state.selectedIds.size > 1 ? 's' : ''}?`,
      message: `This action cannot be undone, and the bookmark${state.selectedIds.size > 1 ? 's' : ''} will be permanently deleted`,
      onConfirm: () => {
        bulkDeleteBookmarks({
          bookmarkIds: Array.from(state.selectedIds),
        });
      },
      primaryActionLabel: 'Yes, Delete forever',
      primaryButtonVariant: 'destructive',
    });
  };

  const handleBookmarkSelect = (bookmark: Bookmark) =>
    dispatch({
      type: !state.selectedIds.has(bookmark.id) ? 'SELECT' : 'DESELECT',
      id: bookmark.id,
    });

  return (
    <div className="space-y-4">
      {state.isSelectMode && allBookmarks.length ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={handleCheckedChange}
              checked={state.selectedIds.size === allBookmarks.length}
              id="selection-toggle"
              disabled={isBulkDeletingBookmarks}
            />
            <Label htmlFor="selection-toggle">{`${state.selectedIds.size || 'None'} selected`}</Label>
          </div>
          <Button
            variant="destructive"
            disabled={state.selectedIds.size === 0 || isBulkDeletingBookmarks}
            onClick={handleDeleteSelected}
          >
            {isBulkDeletingBookmarks
              ? 'Deleting Bookmarks...'
              : 'Delete Permanently'}
          </Button>
        </div>
      ) : null}
      <ResourceList
        data={allBookmarks}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        renderItem={(item) => (
          <BookmarkCard
            bookmark={item}
            isSelected={state.selectedIds.has(item.id)}
            onSelect={state.isSelectMode ? handleBookmarkSelect : undefined}
          />
        )}
        renderSkeleton={() => <BookmarkCardSkeleton />}
        keyExtractor={(item) => item.id.toString()}
        emptyMessage="Your Trash is empty — nothing to restore."
        emptyAction={{
          label: isRefetching ? 'Refreshing...' : 'Refresh',
          onClick: () => refetch(),
          disabled: isRefetching,
        }}
        emptyIcon={<TrashIcon className="h-10 w-10 stroke-muted-foreground" />}
        errorTitle="Couldn't load trashed bookmarks"
        containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
      >
        <div className="flex items-center justify-center w-full col-span-full">
          <Button
            ref={ref}
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                ? 'Load Newer'
                : 'Nothing more to load'}
          </Button>
        </div>
      </ResourceList>
    </div>
  );
};

export default TrashedBookmarkList;

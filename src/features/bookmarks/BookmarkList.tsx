'use client';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import ResourceList from '@/components/ui/ResourceList';
import { useSelection } from '@/context/SelectionContext';
import {
  useBookmarks,
  useBulkTrashBookmarks,
} from '@/features/bookmarks/bookmark.api';
import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import {
  filterInfiniteBookmarks,
  updatePaginatedBookmark,
} from '@/features/bookmarks/bookmark.utils';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import { useBookmarkMetadataUpdates } from '@/hooks/bookmarks/useBookmarkMetadataUpdates';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { useModalStore } from '@/lib/stores/ui/modalStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { LinkIcon } from 'lucide-react';
import { ApiError } from 'next/dist/server/api-utils';
import { useMemo } from 'react';

const BookmarkList = () => {
  const queryClient = useQueryClient();
  const showConfirmDialog = useConfirmDialogStore((s) => s.showConfirmDialog);
  const { dispatch, state: selectionState } = useSelection();
  const { mutate: bulkTrashBookmarks, isPending: isBulkTrashingBookmarks } =
    useBulkTrashBookmarks({
      onMutate(variables) {
        const previousTrashedBookmarks =
          queryClient.getQueryData<InfiniteBookmarksData>(
            QUERY_KEYS.bookmarks.list()
          );

        const toastId = showSuccessToast(
          `Bookmark${selectionState.selectedIds.size > 1 ? 's' : ''} moved to trash successfully`
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
          `An error occurred while moving the bookmark${selectionState.selectedIds.size > 1 ? 's' : ''} to trash`,
          {
            description: (error as ApiError).message,
            id: context?.toastId,
          }
        );
      },
      async onSettled() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.bookmarks.list(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.bookmarks.trashed(),
          }),
        ]);
      },
    });

  useBookmarkMetadataUpdates((data) => {
    console.log('data', data);

    queryClient.setQueryData<InfiniteBookmarksData>(
      QUERY_KEYS.bookmarks.list(),
      (old) =>
        old
          ? updatePaginatedBookmark(old, data.bookmarkId, (b) => ({
              ...b,
              title: data.title || b.title,
              faviconUrl: data?.faviconUrl || b.faviconUrl,
              isMetadataPending: false,
            }))
          : old
    );
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
  } = useBookmarks();
  const allBookmarks = useMemo(() => {
    return data?.pages.flatMap((page) => page.bookmarks) ?? [];
  }, [data]);

  const handleCheckedChange = (checked: boolean) => {
    if (!data) return;

    if (checked) {
      dispatch({
        type: 'SELECT_ALL',
        ids: allBookmarks.map((b) => b.id),
      });
    } else {
      dispatch({ type: 'DESELECT_ALL' });
    }
  };

  const handleDeleteSelected = () => {
    if (selectionState.selectedIds.size === 0) return;
    showConfirmDialog({
      title: `Are you sure you want to move ${selectionState.selectedIds.size} bookmark${selectionState.selectedIds.size > 1 ? 's' : ''} to trash?`,
      message: 'You can restore it from the trash at any time if needed.',
      alertText:
        'Bookmarks in the trash for more than 30 days will be permanently deleted.',
      onConfirm: () => {
        bulkTrashBookmarks({
          bookmarkIds: Array.from(selectionState.selectedIds),
        });
      },
      primaryActionLabel: 'Move to Trash',
    });
  };

  const handleBookmarkSelect = (bookmark: Bookmark) =>
    dispatch({
      type: selectionState.selectedIds.has(bookmark.id) ? 'DESELECT' : 'SELECT',
      id: bookmark.id,
    });

  return (
    <div className="space-y-4">
      {selectionState.isSelectMode && allBookmarks.length ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={handleCheckedChange}
              checked={selectionState.selectedIds.size === allBookmarks.length}
              id="selection-toggle"
              disabled={isBulkTrashingBookmarks}
            />
            <Label htmlFor="selection-toggle">{`${selectionState.selectedIds.size || 'None'} selected`}</Label>
          </div>
          <Button
            variant="destructive"
            disabled={
              selectionState.selectedIds.size === 0 || isBulkTrashingBookmarks
            }
            onClick={handleDeleteSelected}
          >
            {isBulkTrashingBookmarks ? 'Moving to Trash...' : 'Move to Trash'}
          </Button>
        </div>
      ) : null}
      <ResourceList
        listParentClasses={
          selectionState.isSelectMode ? 'h-[calc(100vh-230px)]' : ''
        }
        data={allBookmarks}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        renderItem={(item) => (
          <BookmarkCard
            key={`bookmark-${item.id}`}
            bookmark={item}
            isSelected={selectionState.selectedIds.has(item.id)}
            onSelect={
              selectionState.isSelectMode ? handleBookmarkSelect : undefined
            }
          />
        )}
        renderSkeleton={() => <BookmarkCardSkeleton />}
        emptyMessage="No bookmarks found — add one to get started."
        emptyAction={{
          element: <AddBookmarkButton />,
        }}
        emptyIcon={<LinkIcon className="h-10 w-10 stroke-muted-foreground" />}
        errorTitle="Couldn't load bookmarks"
        containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
      />
    </div>
  );
};

const AddBookmarkButton = () => {
  const openModal = useModalStore((s) => s.openModal);
  const handleAddBookmark = () => {
    openModal({
      type: 'create-bookmark',
    });
  };
  return (
    <Button
      size="sm"
      variant="outline"
      className="mt-4"
      onClick={handleAddBookmark}
    >
      Add Bookmark
    </Button>
  );
};

export default BookmarkList;

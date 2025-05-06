'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import ResourceList from '@/components/ui/resource-list';
import { useSelection } from '@/context/SelectionContext';
import { TrashIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTrashedBookmarks } from '../bookmark.api';
import BookmarkCard from '../BookmarkCard';
import BookmarkCardSkeleton from '../BookmarkCardSkeleton';

const TrashedBookmarkList = () => {
  const { dispatch, state } = useSelection();
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
  };

  return (
    <div className="space-y-4">
      {state.isSelectMode ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              onCheckedChange={handleCheckedChange}
              checked={
                state.selectedIds.size ===
                data?.pages.flatMap((page) => page.bookmarks)?.length
              }
              id="selection-toggle"
            />
            <Label htmlFor="selection-toggle">{`${state.selectedIds.size || 'None'} selected`}</Label>
          </div>
          <Button
            variant="destructive"
            disabled={state.selectedIds.size === 0}
            onClick={handleDeleteSelected}
          >
            Delete
          </Button>
        </div>
      ) : null}
      <ResourceList
        data={data?.pages.flatMap((page) => page.bookmarks)}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        renderItem={(item) => (
          <BookmarkCard
            bookmark={item}
            isSelected={state.selectedIds.has(item.id)}
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

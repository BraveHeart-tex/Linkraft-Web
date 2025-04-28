'use client';
import { TrashIcon } from 'lucide-react';
import { useTrashedBookmarks } from '../bookmark.api';
import BookmarkCard from '../BookmarkCard';
import BookmarkCardSkeleton from '../BookmarkCardSkeleton';
import ResourceList from '@/components/ui/resource-list';
import { Button } from '@/components/ui/button';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

const TrashedBookmarkList = () => {
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

  return (
    <ResourceList
      data={data?.pages.flatMap((page) => page.bookmarks)}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      renderItem={(item) => <BookmarkCard bookmark={item} />}
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
  );
};

export default TrashedBookmarkList;

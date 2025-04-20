'use client';
import { BoxIcon } from 'lucide-react';
import { useTrashedBookmarks } from '../bookmark.api';
import BookmarkCard from '../BookmarkCard';
import BookmarkCardSkeleton from '../BookmarkCardSkeleton';
import ResourceList from '@/components/ui/resource-list';

const TrashedBookmarkList = () => {
  const {
    data: trashedBookmarks,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useTrashedBookmarks();

  return (
    <ResourceList
      data={trashedBookmarks}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      renderItem={(item) => <BookmarkCard bookmark={item} />}
      renderSkeleton={() => <BookmarkCardSkeleton />}
      keyExtractor={(item) => item.id.toString()}
      emptyMessage="Your Trash is empty — nothing to restore."
      emptyIcon={<BoxIcon className="h-10 w-10 stroke-muted-foreground" />}
      emptyAction={{
        label: isRefetching ? 'Refreshing...' : 'Refresh',
        onClick: () => refetch(),
        isDisabled: isRefetching,
      }}
      errorTitle="Couldn't load trashed bookmarks"
      containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
    />
  );
};

export default TrashedBookmarkList;

'use client';
import ResourceList from '@/components/ui/ResourceList';
import AddBookmarkButton from '@/features/bookmarks/AddBookmarkButton';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import { useCollectionBookmarks } from '@/features/collections/collection.api';
import { CollectionWithBookmarks } from '@/features/collections/collection.types';
import { LinkIcon } from 'lucide-react';
import { useMemo } from 'react';

interface CollectionBookmarksListProps {
  collection: CollectionWithBookmarks;
}

const CollectionBookmarksList = ({
  collection,
}: CollectionBookmarksListProps) => {
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    error,
    refetch,
  } = useCollectionBookmarks(
    collection.id,
    collection.bookmarks,
    collection.nextBookmarkCursor
  );

  const allBookmarks = useMemo(() => {
    return data?.pages.flatMap((page) => page.bookmarks) ?? [];
  }, [data]);

  return (
    <ResourceList
      data={allBookmarks}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      renderItem={(item) => (
        <BookmarkCard key={`bookmark-${item.id}`} bookmark={item} />
      )}
      renderSkeleton={() => <BookmarkCardSkeleton />}
      emptyMessage="No bookmarks found for this collection — add one to get started."
      emptyAction={{
        element: (
          <AddBookmarkButton
            modalPayload={{
              forCollectionId: collection.id,
            }}
          />
        ),
      }}
      emptyIcon={<LinkIcon className="h-10 w-10 stroke-muted-foreground" />}
      errorTitle="Couldn't load bookmarks"
      containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
    />
  );
};

export default CollectionBookmarksList;

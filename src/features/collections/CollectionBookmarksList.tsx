'use client';
import { Button } from '@/components/ui/Button';
import ResourceList from '@/components/ui/ResourceList';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import { CollectionWithBookmarks } from '@/features/collections/collection.types';
import { useModalStore } from '@/lib/stores/ui/modalStore';
import { LinkIcon } from 'lucide-react';

interface CollectionBookmarksListProps {
  collection: CollectionWithBookmarks;
}

const CollectionBookmarksList = ({
  collection,
}: CollectionBookmarksListProps) => {
  const hasNextPage = false;
  const isFetchingNextPage = false;
  const isLoading = false;
  const error = null;
  const fetchNextPage = () => {};
  const refetch = () => {};

  return (
    <ResourceList
      data={collection.bookmarks}
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
      emptyMessage="No bookmarks found — add one to get started."
      emptyAction={{
        element: <AddBookmarkButton />,
      }}
      emptyIcon={<LinkIcon className="h-10 w-10 stroke-muted-foreground" />}
      errorTitle="Couldn't load bookmarks"
      containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
    />
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

export default CollectionBookmarksList;

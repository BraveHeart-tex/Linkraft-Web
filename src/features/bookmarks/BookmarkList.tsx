'use client';

import { Button } from '@/components/ui/button';
import ResourceList from '@/components/ui/resource-list';
import { useBookmarks } from '@/features/bookmarks/bookmark.api';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import { useState } from 'react';
import BookmarkFormDialog from './BookmarkFormDialog';

const BookmarkList = () => {
  const { data: bookmarks, isLoading, error, refetch } = useBookmarks();

  return (
    <ResourceList
      data={bookmarks}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      renderItem={(item) => <BookmarkCard bookmark={item} />}
      renderSkeleton={() => <BookmarkCardSkeleton />}
      keyExtractor={(item) => item.id.toString()}
      emptyMessage="No bookmarks found — add one to get started."
      emptyAction={{
        element: <AddBookmarkDialog />,
      }}
      errorTitle="Couldn't load bookmarks"
      containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
    />
  );
};

const AddBookmarkDialog = () => {
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  return (
    <>
      <BookmarkFormDialog
        isOpen={isBookmarkDialogOpen}
        onOpenChange={setIsBookmarkDialogOpen}
      />
      <Button
        size="sm"
        variant="outline"
        className="mt-4"
        onClick={() => setIsBookmarkDialogOpen(true)}
      >
        Add Bookmark
      </Button>
    </>
  );
};

export default BookmarkList;

'use client';

import { Button } from '@/components/ui/button';
import ResourceList from '@/components/ui/resource-list';
import { useBookmarks } from '@/features/bookmarks/bookmark.api';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import BookmarkFormDialog from '@/features/bookmarks/BookmarkFormDialog';
import { LinkIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const BookmarkList = () => {
  const { inView, ref } = useInView({
    rootMargin: '100px 0px 100px 0px',
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

  React.useEffect(() => {
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
      keyExtractor={(item) => item?.id?.toString?.()}
      emptyMessage="No bookmarks found — add one to get started."
      emptyAction={{
        element: <AddBookmarkDialog />,
      }}
      emptyIcon={<LinkIcon className="h-10 w-10 stroke-muted-foreground" />}
      errorTitle="Couldn't load bookmarks"
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

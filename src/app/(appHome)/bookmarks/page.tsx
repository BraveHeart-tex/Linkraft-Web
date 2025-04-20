'use client';

import { Button } from '@/components/ui/button';
import ResourceList from '@/components/ui/resource-list';
import { useBookmarks } from '@/features/bookmarks/bookmark.api';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import BookmarkCardSkeleton from '@/features/bookmarks/BookmarkCardSkeleton';
import { LinkIcon } from 'lucide-react';

const BookmarksPage = () => {
  const { data: bookmarks, isLoading, error, refetch } = useBookmarks();

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <LinkIcon className="size-7" />
            <div className="">
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                All Bookmarks
              </h1>
              <p className="text-muted-foreground text-sm">
                Bookmarks from every Collection
              </p>
            </div>
          </div>
        </div>
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
            element: (
              <Button size="sm" variant="outline" className="mt-4">
                Add Bookmark
              </Button>
            ),
          }}
          errorTitle="Couldn't load bookmarks"
          containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
        />
      </div>
    </main>
  );
};

export default BookmarksPage;

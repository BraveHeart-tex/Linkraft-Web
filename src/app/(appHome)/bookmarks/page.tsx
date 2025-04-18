'use client';

import { useBookmarks } from '@/features/bookmarks/bookmark.api';
import BookmarkCard from '@/features/bookmarks/BookmarkCard';
import { LinkIcon } from 'lucide-react';

const BookmarksPage = () => {
  const { data: bookmarks, isLoading, isError } = useBookmarks();

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
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            {/* TODO: Will have skeletons here */}
            Loading...
          </div>
        ) : null}
        {!isLoading && isError ? (
          <div className="min-h-[60vh] flex items-center justify-center flex-col space-y-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              An Error Occurred
            </h3>
            <p className="text-muted-foreground">
              Please try again after refreshing the page
            </p>
          </div>
        ) : null}
        {bookmarks && bookmarks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            {bookmarks?.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        ) : null}
        {!isLoading && !isError && bookmarks?.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center flex-col space-y-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No Bookmarks Yet
            </h3>
            <p className="text-muted-foreground">
              Get started by adding a new bookmark
            </p>
            <div className="pt-1">Add Button Here</div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default BookmarksPage;

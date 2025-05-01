import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';

export const updatePaginatedBookmark = (
  data: InfiniteBookmarksData,
  bookmarkId: Bookmark['id'],
  updater: (b: Bookmark) => Bookmark
): InfiniteBookmarksData => {
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      bookmarks: page.bookmarks.map((b) =>
        b.id === bookmarkId ? updater(b) : b
      ),
    })),
  };
};

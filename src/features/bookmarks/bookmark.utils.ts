import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { showErrorToast, showSuccessToast, ToastId } from '@/lib/toast';
import { QueryKey, useQueryClient } from '@tanstack/react-query';

interface BookmarkMutateContext {
  previousBookmarks: InfiniteBookmarksData | undefined;
  toastId: ToastId;
}

export const updatePaginatedBookmark = (
  data: InfiniteBookmarksData | undefined,
  bookmarkId: Bookmark['id'],
  updater: (b: Bookmark) => Bookmark
): InfiniteBookmarksData | undefined => {
  if (!data) return data;
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

export function useOptimisticRemoveHandler<T extends object>({
  queryKey,
  getId,
  successMessage,
}: {
  queryKey: QueryKey;
  getId: (variables: T) => Bookmark['id'];
  successMessage: string;
}) {
  const queryClient = useQueryClient();

  return {
    async onMutate(variables: T) {
      const toastId = showSuccessToast(successMessage);

      await queryClient.cancelQueries({ queryKey });

      const previousBookmarks =
        queryClient.getQueryData<InfiniteBookmarksData>(queryKey);
      if (!previousBookmarks) return;

      queryClient.setQueryData<InfiniteBookmarksData>(queryKey, (oldData) =>
        oldData
          ? filterInfiniteBookmarks(
              oldData,
              (bookmark) => bookmark.id !== getId(variables)
            )
          : oldData
      );

      return { previousBookmarks, toastId };
    },

    onError(
      error: ErrorApiResponse,
      _variables: T,
      context?: BookmarkMutateContext
    ) {
      queryClient.setQueryData(queryKey, context?.previousBookmarks);
      showErrorToast('An error occurred', {
        description: error.message,
        id: context?.toastId,
      });
    },
  };
}

export const filterInfiniteBookmarks = (
  oldData: InfiniteBookmarksData,
  predicate: (bookmark: Bookmark) => boolean
): InfiniteBookmarksData => {
  if (!oldData) return oldData;

  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      bookmarks: page.bookmarks.filter(predicate),
    })),
  };
};

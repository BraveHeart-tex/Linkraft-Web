import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { showErrorToast, showSuccessToast, ToastId } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';

interface BookmarkMutateContext {
  previousBookmarks: InfiniteBookmarksData | undefined;
  toastId: ToastId;
}

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

export function useOptimisticRemoveHandler({
  queryKey,
  getId,
  successMessage,
}: {
  queryKey: unknown[];
  getId: (variables: Record<string, unknown>) => string | number;
  successMessage: string;
}) {
  const queryClient = useQueryClient();

  return {
    async onMutate(variables: Record<string, unknown>) {
      const toastId = showSuccessToast(successMessage);

      await queryClient.cancelQueries({ queryKey });

      const previousBookmarks =
        queryClient.getQueryData<InfiniteBookmarksData>(queryKey);
      if (!previousBookmarks) return;

      queryClient.setQueryData<InfiniteBookmarksData>(queryKey, (oldData) =>
        oldData
          ? {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                bookmarks: page.bookmarks.filter(
                  (bookmark) => bookmark.id !== getId(variables)
                ),
              })),
            }
          : undefined
      );

      return { previousBookmarks, toastId };
    },

    onError(
      error: ErrorApiResponse,
      _variables: Record<string, unknown>,
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

export function useOnSettledHandler(queryKeys: readonly unknown[]) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all(
      queryKeys.map((key) =>
        queryClient.invalidateQueries({ queryKey: key as unknown[] })
      )
    );
  };
}

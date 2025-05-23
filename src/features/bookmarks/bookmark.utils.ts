import {
  Bookmark,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { removeItemFromInfiniteQueryData } from '@/lib/query/infinite/cacheUtils';
import { showErrorToast, showSuccessToast, ToastId } from '@/lib/toast';
import { QueryKey, useQueryClient } from '@tanstack/react-query';

interface BookmarkMutateContext {
  previousBookmarks: InfiniteBookmarksData | undefined;
  toastId: ToastId;
}

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
        removeItemFromInfiniteQueryData(
          oldData,
          (bookmark) => bookmark.id !== getId(variables)
        )
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

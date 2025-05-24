'use client';
import { ApiResponse, ErrorApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { Nullable } from '@/lib/common.types';
import { InfiniteDataPage } from '@/lib/query/infinite/types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { ToastId } from '@/lib/toast';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  Bookmark,
  CreateBookmarkDto,
  GetBookmarksResponse,
  InfiniteBookmarksData,
  UpdateBookmarkDto,
  UpdateBookmarkResponse,
} from './bookmark.types';

export const useUpdateBookmark = (
  options?: UseMutationOptions<
    Nullable<UpdateBookmarkResponse>,
    unknown,
    UpdateBookmarkDto,
    { previousBookmarks: InfiniteBookmarksData }
  >
): UseMutationResult<
  Nullable<UpdateBookmarkResponse>,
  unknown,
  UpdateBookmarkDto,
  { previousBookmarks: InfiniteBookmarksData }
> =>
  useMutation({
    mutationFn: async (data) => {
      const response = await safeApiCall(() =>
        api.put<ApiResponse<UpdateBookmarkResponse>>(
          API_ROUTES.bookmark.updateBookmark(data.id),
          data
        )
      );

      return response.data;
    },
    ...options,
  });

export const useCreateBookmark = (
  options?: UseMutationOptions<
    ApiResponse<Bookmark>,
    unknown,
    Omit<CreateBookmarkDto, 'tags'>
  >
): UseMutationResult<
  ApiResponse<Bookmark>,
  unknown,
  Omit<CreateBookmarkDto, 'tags'>
> => {
  return useMutation({
    mutationFn: async (data) => {
      return safeApiCall(() =>
        api.post<ApiResponse<Bookmark>>(
          API_ROUTES.bookmark.createBookmark,
          data
        )
      );
    },
    ...options,
  });
};

export interface TrashBookmarkVariables {
  bookmarkId: Bookmark['id'];
}

export interface TrashBookmarkContext {
  previousBookmarks: InfiniteBookmarksData | undefined;
  previousCollectionBookmarks: InfiniteBookmarksData | undefined;
  toastId: number | string;
}

export const useTrashBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    ErrorApiResponse,
    TrashBookmarkVariables,
    TrashBookmarkContext
  >
): UseMutationResult<
  ApiResponse<null>,
  ErrorApiResponse,
  TrashBookmarkVariables,
  TrashBookmarkContext
> => {
  return useMutation({
    mutationFn: async (data) => {
      return safeApiCall(() =>
        api.delete(API_ROUTES.bookmark.trashBookmark(data.bookmarkId))
      );
    },
    ...options,
  });
};

export interface PermanentlyDeleteBookmarkVariables {
  bookmarkId: Bookmark['id'];
}

export const usePermanentlyDeleteBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    ErrorApiResponse,
    PermanentlyDeleteBookmarkVariables,
    {
      previousBookmarks: InfiniteBookmarksData | undefined;
      toastId: number | string;
    }
  >
): UseMutationResult<
  ApiResponse<null>,
  ErrorApiResponse,
  PermanentlyDeleteBookmarkVariables,
  {
    previousBookmarks: InfiniteBookmarksData | undefined;
    toastId: number | string;
  }
> =>
  useMutation({
    mutationFn: async (data) =>
      safeApiCall(() =>
        api.delete(
          API_ROUTES.bookmark.permanentlyDeleteBookmark(data.bookmarkId)
        )
      ),
    ...options,
  });

export const useBookmarks = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.bookmarks.list(),
    queryFn: async ({
      pageParam,
    }): Promise<InfiniteDataPage<Bookmark, number>> => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getBookmarks({ nextCursor: pageParam })}`
        )
      );

      return {
        items: response?.data?.items || [],
        nextCursor: response?.data?.nextCursor || undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};

export const useTrashedBookmarks = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.bookmarks.trashed(),
    queryFn: async ({
      pageParam,
    }): Promise<InfiniteDataPage<Bookmark, number>> => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getTrashedBookmarks(pageParam)}`
        )
      );

      return {
        items: response.data?.items || [],
        nextCursor: response?.data?.nextCursor || undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};

export const useRestoreBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { bookmarkId: number },
    {
      previousTrashedBookmarks: InfiniteBookmarksData;
      toastId: number | string;
    }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
  {
    previousTrashedBookmarks: InfiniteBookmarksData;
    toastId: number | string;
  }
> =>
  useMutation({
    mutationFn: async (data) =>
      safeApiCall(() =>
        api.put<ApiResponse<null>>(
          API_ROUTES.bookmark.restoreBookmark(data.bookmarkId)
        )
      ),
    ...options,
  });

export const fetchBookmarkById = async (bookmarkId: Bookmark['id']) =>
  safeApiCall(() =>
    api.get<ApiResponse<Bookmark>>(API_ROUTES.bookmark.getById(bookmarkId))
  ).then((res) => res.data);

interface BulkDeleteBookmarksInput {
  bookmarkIds: Bookmark['id'][];
}

interface BulkDeleteBookmarksContext {
  previousTrashedBookmarks: InfiniteBookmarksData;
  toastId: ToastId;
}

export const useBulkDeleteBookmarks = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    BulkDeleteBookmarksInput,
    BulkDeleteBookmarksContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  BulkDeleteBookmarksInput,
  BulkDeleteBookmarksContext
> =>
  useMutation({
    mutationFn: ({ bookmarkIds }) =>
      safeApiCall(() =>
        api.delete(API_ROUTES.bookmark.bulkDeleteBookmarks, {
          data: {
            bookmarkIds,
          },
        })
      ),
    ...options,
  });

export const useBulkTrashBookmarks = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    BulkDeleteBookmarksInput,
    BulkDeleteBookmarksContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  BulkDeleteBookmarksInput,
  BulkDeleteBookmarksContext
> =>
  useMutation({
    mutationFn: ({ bookmarkIds }) =>
      safeApiCall(() =>
        api.delete(API_ROUTES.bookmark.bulkTrashBookmarks, {
          data: {
            bookmarkIds,
          },
        })
      ),
    ...options,
  });

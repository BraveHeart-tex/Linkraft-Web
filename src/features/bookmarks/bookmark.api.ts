'use client';
import { useSocket } from '@/context/SocketProvider';
import api from '@/lib/api/api';
import { ApiResponse, ErrorApiResponse } from '@/lib/api/api.types';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { Nullable } from '@/lib/common.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { SOCKET_EVENTS } from '@/lib/socket';
import { ToastId } from '@/lib/toast';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Bookmark,
  BookmarkMetadataResponse,
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

export const useTrashBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    ErrorApiResponse,
    TrashBookmarkVariables,
    { previousBookmarks: InfiniteBookmarksData; toastId: number | string }
  >
): UseMutationResult<
  ApiResponse<null>,
  ErrorApiResponse,
  TrashBookmarkVariables,
  { previousBookmarks: InfiniteBookmarksData; toastId: number | string }
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
    { previousBookmarks: InfiniteBookmarksData; toastId: number | string }
  >
): UseMutationResult<
  ApiResponse<null>,
  ErrorApiResponse,
  PermanentlyDeleteBookmarkVariables,
  { previousBookmarks: InfiniteBookmarksData; toastId: number | string }
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
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getBookmarks(pageParam)}`
        )
      );

      return {
        bookmarks: response?.data?.items || [],
        nextCursor: response?.data?.nextCursor,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};

export const useTrashedBookmarks = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.bookmarks.trashed(),
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getTrashedBookmarks(pageParam)}`
        )
      );

      return {
        bookmarks: response.data?.items || [],
        nextCursor: response?.data?.nextCursor,
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

export const useBookmarkMetadataUpdate = (
  bookmarkId: number,
  onUpdate: (metadata: BookmarkMetadataResponse) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.BOOKMARK.SUBSCRIBE, { bookmarkId });
    const event = SOCKET_EVENTS.BOOKMARK.UPDATE;
    const onMetadataUpdate = (data: BookmarkMetadataResponse) => {
      if (data.bookmarkId === bookmarkId) {
        onUpdate(data);
      }
    };
    socket.on(event, onMetadataUpdate);

    return () => {
      socket.off(event, onMetadataUpdate);
    };
  }, [bookmarkId, onUpdate, socket]);
};

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

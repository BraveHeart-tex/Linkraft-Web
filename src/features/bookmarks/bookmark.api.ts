'use client';
import { ApiResponse } from '@/lib/api/api.types';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  Bookmark,
  CreateBookmarkDto,
  GetBookmarksResponse,
  InfiniteBookmarksData,
  UpdateBookmarkDto,
  UpdateBookmarkResponse,
} from './bookmark.types';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useSocket } from '@/context/SocketProvider';
import { safeApiCall } from '@/lib/api/safeApiCall';
import api from '@/lib/api/api';
import { Nullable } from '@/lib/common.types';

export const useUpdateBookmark = (
  options?: UseMutationOptions<
    Nullable<UpdateBookmarkResponse>,
    unknown,
    UpdateBookmarkDto,
    { previousBookmarks: Bookmark[] }
  >
): UseMutationResult<
  Nullable<UpdateBookmarkResponse>,
  unknown,
  UpdateBookmarkDto,
  { previousBookmarks: Bookmark[] }
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

export const useTrashBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { bookmarkId: number },
    { previousBookmarks: InfiniteBookmarksData; toastId: number | string }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
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

export const usePermanentlyDeleteBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { bookmarkId: number },
    { previousBookmarks: Bookmark[]; toastId: number | string }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
  { previousBookmarks: Bookmark[]; toastId: number | string }
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
    queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
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
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useTrashedBookmarks = (
  options?: Omit<UseQueryOptions<Bookmark[], Error>, 'queryKey'>
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.bookmarks.getTrashedBookmarks],
    queryFn: async () => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<Bookmark[]>>(
          `${API_ROUTES.bookmark.getTrashedBookmarks}`
        )
      );

      return response.data ?? [];
    },
    ...options,
  });
};

export const useRestoreBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { bookmarkId: number },
    {
      previousBookmarks: Bookmark[];
      previousTrashedBookmarks: Bookmark[];
      toastId: number | string;
    }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
  {
    previousBookmarks: Bookmark[];
    previousTrashedBookmarks: Bookmark[];
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
  onUpdate: (metadata: Pick<Bookmark, 'faviconUrl' | 'title'>) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToBookmark', { bookmarkId });
    const event = `bookmark:update`;
    socket.on(event, onUpdate);

    return () => {
      socket.off(event, onUpdate);
    };
  }, [bookmarkId, onUpdate, socket]);
};

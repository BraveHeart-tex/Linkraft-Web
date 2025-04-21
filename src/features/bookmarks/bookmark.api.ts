'use client';
import { ApiResponse } from '@/lib/api/api.types';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  Bookmark,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from './bookmark.types';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useSocket } from '@/context/SocketProvider';
import { safeApiCall } from '@/lib/api/safeApiCall';
import api from '@/lib/api/api';

export const useUpdateBookmark = (
  options?: UseMutationOptions<
    ApiResponse<Bookmark>,
    unknown,
    UpdateBookmarkDto
  >
): UseMutationResult<ApiResponse<Bookmark>, unknown, UpdateBookmarkDto> =>
  useMutation({
    mutationFn: async (data) =>
      safeApiCall(() => api.put(API_ROUTES.bookmark.updateBookmark(data.id))),
    ...options,
  });

export const useCreateBookmark = (
  options?: UseMutationOptions<
    ApiResponse<Bookmark>,
    unknown,
    CreateBookmarkDto
  >
): UseMutationResult<ApiResponse<Bookmark>, unknown, CreateBookmarkDto> => {
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
    { previousBookmarks: Bookmark[]; toastId: number | string }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
  { previousBookmarks: Bookmark[]; toastId: number | string }
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

export const useBookmarks = (
  options?: Omit<UseQueryOptions<Bookmark[], Error>, 'queryKey'>
  // queryParams?: {
  //   page: number;
  //   pageSize: number;
  //   search?: string;
  // }
) => {
  // const page = queryParams?.page ?? 1;
  // const pageSize = queryParams?.pageSize ?? 10;
  // const search = queryParams?.search ?? '';

  // const queryString = new URLSearchParams({
  //   page: page.toString(),
  //   pageSize: pageSize.toString(),
  //   ...(search ? { search } : {}),
  // }).toString();

  return useQuery({
    queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
    queryFn: async () => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<Bookmark[]>>(`${API_ROUTES.bookmark.getBookmarks}`)
      );

      return response.data || [];
    },
    ...options,
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
  onUpdate: (metadata: Pick<Bookmark, 'faviconUrl' | 'title'>) => void,
  enabled: boolean
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const event = `bookmark:update:${bookmarkId}`;

    if (enabled) {
      socket.on(event, onUpdate);
    }

    return () => {
      socket.off(event, onUpdate);
    };
  }, [bookmarkId, onUpdate, socket, enabled]);
};

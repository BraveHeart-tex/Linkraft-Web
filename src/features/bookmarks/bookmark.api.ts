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
import { Bookmark, CreateBookmarkDto } from './bookmark.types';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useSocket } from '@/context/SocketProvider';
import { safeApiCall } from '@/lib/api/safeApiCall';
import api from '@/lib/api/api';

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

export const useDeleteBookmark = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { bookmarkId: number },
    { previousBookmarks: Bookmark[] }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { bookmarkId: number },
  { previousBookmarks: Bookmark[] }
> => {
  return useMutation({
    mutationFn: async (data) => {
      return safeApiCall(() =>
        api.delete(API_ROUTES.bookmark.deleteBookmark(data.bookmarkId))
      );
    },
    ...options,
  });
};

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

// TODO: Have enabled pattern here
export const useBookmarkMetadataUpdate = (
  bookmarkId: number,
  onUpdate: (metadata: Pick<Bookmark, 'faviconUrl' | 'title'>) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const event = `bookmark:update:${bookmarkId}`;

    socket.on(event, onUpdate);

    return () => {
      socket.off(event, onUpdate);
    };
  }, [bookmarkId, onUpdate, socket]);
};

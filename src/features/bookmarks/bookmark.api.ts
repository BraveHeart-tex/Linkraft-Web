import api from '@/lib/api';
import { ApiResponse } from '@/lib/api.types';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { Bookmark, CreateBookmarkDto } from './bookmark.types';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useSocket } from '@/context/SocketProvider';

export const useCreateBookmark = (
  options?: UseMutationOptions<
    ApiResponse<Bookmark>,
    unknown,
    CreateBookmarkDto
  >
): UseMutationResult<ApiResponse<Bookmark>, unknown, CreateBookmarkDto> => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post<ApiResponse<Bookmark>>(
        API_ROUTES.bookmark.createBookmark,
        data
      );

      return response.data;
    },
    ...options,
  });
};

export const useBookmarks = () =>
  useQuery({
    queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Bookmark[]>>(
        // TODO: Make this dynamic later
        `${API_ROUTES.bookmark.getBookmarks}?page=1&pageSize=10`
      );

      return response.data.data;
    },
  });

export const useBookmarkUpdate = (
  bookmarkId: number,
  onUpdate: (metadata: { title: string }) => void
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

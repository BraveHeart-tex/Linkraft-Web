import api from '@/lib/api';
import { ApiResponse } from '@/lib/api.types';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { Bookmark, CreateBookmarkDto } from './bookmark.types';

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

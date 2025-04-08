import { ApiResponse } from '@/lib/api.types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { CreateCollectionDto } from './collection.schema';
import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { Collection } from './collection.types';

export const useCreateCollection = (
  options?: UseMutationOptions<
    ApiResponse<Collection>,
    unknown,
    CreateCollectionDto
  >
): UseMutationResult<ApiResponse<Collection>, unknown, CreateCollectionDto> =>
  useMutation({
    mutationFn: async (data: CreateCollectionDto) => {
      const response = await api.post<ApiResponse<Collection>>(
        API_ROUTES.collection.createCollection,
        data
      );
      return response.data;
    },
    ...options,
  });

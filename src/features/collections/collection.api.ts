import { ApiResponse } from '@/lib/api.types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { CreateCollectionDto } from './collection.schema';
import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { Collection } from './collection.types';
import { QUERY_KEYS } from '@/lib/queryKeys';

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

export const useCollections = () =>
  useQuery({
    queryFn: async () => {
      const response = await api.get<
        ApiResponse<(Collection & { bookmarkCount: number })[]>
      >(API_ROUTES.collection.getUserCollections);

      return response.data;
    },
    queryKey: [QUERY_KEYS.collections.getCollections],
  });

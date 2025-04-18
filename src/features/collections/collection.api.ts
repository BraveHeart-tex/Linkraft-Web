import { ApiResponse } from '@/lib/api/api.types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.schema';
import { API_ROUTES } from '@/routes/apiRoutes';
import { Collection, CollectionWithBookmarkCount } from './collection.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import api from '@/lib/api/api';
import { safeApiCall } from '@/lib/api/safeApiCall';

export const useCreateCollection = (
  options?: UseMutationOptions<
    ApiResponse<Collection>,
    unknown,
    CreateCollectionDto
  >
): UseMutationResult<ApiResponse<Collection>, unknown, CreateCollectionDto> =>
  useMutation({
    mutationFn: async (data: CreateCollectionDto) => {
      return safeApiCall(() =>
        api.post<ApiResponse<Collection>>(
          API_ROUTES.collection.createCollection,
          data
        )
      );
    },
    ...options,
  });

export const useCollections = () =>
  useQuery({
    queryFn: async () => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<CollectionWithBookmarkCount[]>>(
          API_ROUTES.collection.getUserCollections
        )
      );

      return response.data;
    },
    queryKey: [QUERY_KEYS.collections.getCollections],
  });

export const useDeleteCollection = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { collectionId: number },
    { previousCollections: CollectionWithBookmarkCount[] }
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { collectionId: number },
  { previousCollections: CollectionWithBookmarkCount[] }
> =>
  useMutation({
    mutationFn: async ({ collectionId }) => {
      return safeApiCall(() =>
        api.delete<ApiResponse<null>>(
          API_ROUTES.collection.deleteCollection(collectionId)
        )
      );
    },
    ...options,
  });

interface UpdateCollectionContext {
  previousCollections: CollectionWithBookmarkCount[];
  toastId: string | number;
}

export const useUpdateCollection = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    UpdateCollectionDto,
    UpdateCollectionContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  UpdateCollectionDto,
  UpdateCollectionContext
> =>
  useMutation({
    mutationFn: async (data) => {
      return await safeApiCall(() =>
        api.put<ApiResponse<null>>(
          API_ROUTES.collection.updateCollection(data.id),
          data
        )
      );
    },
    ...options,
  });

import { ApiResponse } from '@/lib/api.types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.schema';
import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { Collection, CollectionWithBookmarkCount } from './collection.types';
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
        ApiResponse<CollectionWithBookmarkCount[]>
      >(API_ROUTES.collection.getUserCollections);

      return response.data.data;
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
      const response = await api.delete<ApiResponse<null>>(
        API_ROUTES.collection.deleteCollection(collectionId)
      );

      return response.data;
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
      const response = await api.put(
        API_ROUTES.collection.updateCollection(data.id),
        data
      );

      return response.data;
    },
    ...options,
  });

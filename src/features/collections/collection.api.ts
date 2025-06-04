import {
  Bookmark,
  GetBookmarksResponse,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { InfiniteDataPage } from '@/lib/query/infinite/types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { ToastId } from '@/lib/toast';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import {
  CreateCollectionInput,
  UpdateCollectionInput,
} from './collection.schema';
import {
  Collection,
  CollectionWithBookmarkCount,
  GetCollectionsResponse,
} from './collection.types';

export const useCreateCollection = (
  options?: UseMutationOptions<
    ApiResponse<Collection>,
    unknown,
    CreateCollectionInput
  >
): UseMutationResult<ApiResponse<Collection>, unknown, CreateCollectionInput> =>
  useMutation({
    mutationFn: async (data: CreateCollectionInput) => {
      return safeApiCall(() =>
        api.post<ApiResponse<Collection>>(
          API_ROUTES.collection.createCollection,
          data
        )
      );
    },
    ...options,
  });

export const usePaginatedCollections = (query?: string, enabled?: boolean) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.collections.list(query),
    queryFn: async (): Promise<
      InfiniteDataPage<CollectionWithBookmarkCount>
    > => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetCollectionsResponse>>(
          API_ROUTES.collection.getUserCollections(query)
        )
      );

      return {
        items: response.data?.items || [],
        nextCursor: response.data?.nextCursor || undefined,
      };
    },
    enabled: enabled !== undefined ? enabled : true,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

export const useCollections = (params?: {
  query?: string;
  initialData?: CollectionWithBookmarkCount[];
}) =>
  useQuery({
    queryKey: QUERY_KEYS.collections.list(params?.query),
    queryFn: async (): Promise<CollectionWithBookmarkCount[]> => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetCollectionsResponse>>(
          API_ROUTES.collection.getUserCollections(params?.query)
        )
      );

      return response.data?.items || [];
    },
    initialData: params?.initialData,
  });

interface UseDeleteCollectionContext {
  toastId?: ToastId;
  previousCollections?: CollectionWithBookmarkCount[];
  previousBookmarks?: InfiniteBookmarksData;
}

export const useDeleteCollection = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { collectionId: Collection['id'] },
    UseDeleteCollectionContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { collectionId: Collection['id'] },
  UseDeleteCollectionContext
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
}

export const useUpdateCollection = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    UpdateCollectionInput,
    UpdateCollectionContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  UpdateCollectionInput,
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

export const useCollectionBookmarks = (
  collectionId: Collection['id'],
  initialBookmarks: Bookmark[],
  initialNextCursor?: string | null
) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.collections.listBookmarks(collectionId),
    queryFn: async ({ pageParam }): Promise<InfiniteDataPage<Bookmark>> => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getBookmarks({
            nextCursor: pageParam,
            collectionId: collectionId,
          })}`
        )
      );

      return {
        items: response.data?.items || [],
        nextCursor: response.data?.nextCursor || undefined,
      };
    },
    enabled: false,
    initialData: {
      pages: [
        {
          items: initialBookmarks,
          nextCursor: initialNextCursor,
        },
      ],
      pageParams: [initialNextCursor ?? ''],
    },
    initialPageParam: initialNextCursor ?? '',
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};

import {
  Bookmark,
  GetBookmarksResponse,
  InfiniteBookmarksData,
} from '@/features/bookmarks/bookmark.types';
import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { CreateCollectionDto, UpdateCollectionDto } from './collection.schema';
import {
  Collection,
  CollectionWithBookmarkCount,
  GetCollectionsResponse,
} from './collection.types';

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

// FIXME: Gets's all the owned collections, but no pagination
export const useCollections = () =>
  useQuery({
    queryFn: async () => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<CollectionWithBookmarkCount[]>>(
          // TODO: Will remove this later
          '/collections'
        )
      );

      return response.data || [];
    },
    queryKey: QUERY_KEYS.collections.list(),
  });

export const usePaginatedCollections = () =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.collections.list(),
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetCollectionsResponse>>(
          API_ROUTES.collection.getUserCollections(pageParam)
        )
      );

      return {
        collections: response.data?.items || [],
        nextCursor: response.data?.nextCursor,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

interface UseDeleteCollectionContext {
  previousCollections: CollectionWithBookmarkCount[];
  previousBookmarks?: InfiniteBookmarksData;
}

export const useDeleteCollection = (
  options?: UseMutationOptions<
    ApiResponse<null>,
    unknown,
    { collectionId: number },
    UseDeleteCollectionContext
  >
): UseMutationResult<
  ApiResponse<null>,
  unknown,
  { collectionId: number },
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

export const useCollectionBookmarks = (
  collectionId: Collection['id'],
  initialBookmarks: Bookmark[],
  initialNextCursor?: number | null
) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.collections.listBookmarks(collectionId),
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<GetBookmarksResponse>>(
          `${API_ROUTES.bookmark.getBookmarks({
            nextCursor: pageParam,
            collectionId: collectionId,
          })}`
        )
      );

      return {
        bookmarks: response.data?.items || [],
        nextCursor: response.data?.nextCursor,
      };
    },
    initialData: {
      pages: [
        {
          bookmarks: initialBookmarks,
          nextCursor: initialNextCursor,
        },
      ],
      pageParams: [initialNextCursor ?? 0],
    },
    initialPageParam: initialNextCursor ?? 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });
};

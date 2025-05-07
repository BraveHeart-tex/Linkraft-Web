import { SearchResponse } from '@/features/search/search.types';
import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseSearchParams {
  query: string;
}

export const useSearch = ({ query }: UseSearchParams) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.search.list(query),
    initialPageParam: '',
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<SearchResponse>>(
          API_ROUTES.search.getSearchResults,
          {
            params: {
              q: query,
              cursor: pageParam,
            },
          }
        )
      );

      return {
        results: response?.data?.results || [],
        nextCursor: response?.data?.nextCursor || null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

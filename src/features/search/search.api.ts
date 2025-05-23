import { SearchResponse, SearchResult } from '@/features/search/search.types';
import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { InfiniteDataPage } from '@/lib/query/infinite/types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseSearchParams {
  query: string;
  enabled?: boolean;
}

export const useSearch = ({ query, enabled }: UseSearchParams) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.search.list(query),
    initialPageParam: '',
    queryFn: async ({
      pageParam,
    }): Promise<InfiniteDataPage<SearchResult, string>> => {
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
        items: response?.data?.results || [],
        nextCursor: response?.data?.nextCursor || undefined,
      };
    },
    enabled: enabled !== undefined ? enabled : true,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

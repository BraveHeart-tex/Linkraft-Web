import { SearchResponse } from '@/features/search/search.types';
import api from '@/lib/api/api';
import { ApiResponse } from '@/lib/api/api.types';
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
    initialPageParam: {
      cursorId: null as string | null,
      cursorRank: null as number | null,
    },
    queryFn: async ({ pageParam }) => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<SearchResponse>>(
          API_ROUTES.search.getSearchResults,
          {
            params: {
              q: query,
              cursorId: pageParam.cursorId,
              cursorRank: pageParam.cursorRank,
            },
          }
        )
      );

      return {
        results: response?.data?.results || [],
        nextCursor: response?.data?.nextCursor || null,
      };
    },
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage.results?.[lastPage.results.length - 1];
      if (!lastItem) return undefined;

      return {
        cursorId: lastItem.id as string | null,
        cursorRank: lastItem.rank as number | null,
      };
    },
  });

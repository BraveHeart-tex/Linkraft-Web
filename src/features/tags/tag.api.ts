import api from '@/lib/api/api';
import { ApiResponse } from '@/lib/api/api.types';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Tag } from './tag.types';

export const useTags = (
  options?: Omit<
    UseQueryOptions<(Tag & { usageCount: number })[], Error>,
    'queryKey'
  >
) =>
  useQuery({
    queryKey: QUERY_KEYS.tags.list(),
    queryFn: async () => {
      const result = await safeApiCall(() =>
        api.get<ApiResponse<(Tag & { usageCount: number })[]>>(
          API_ROUTES.tags.getUserTags
        )
      );

      return result.data || [];
    },
    ...options,
  });

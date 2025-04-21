import api from '@/lib/api/api';
import { ApiResponse } from '@/lib/api/api.types';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import { Tag } from './tag.types';

export const useTags = () =>
  useQuery({
    queryKey: [QUERY_KEYS.tags.getTags],
    queryFn: async () => {
      const result = await safeApiCall(() =>
        api.get<ApiResponse<(Tag & { usageCount: number })[]>>(
          API_ROUTES.tags.getUserTags
        )
      );

      return result.data || [];
    },
  });

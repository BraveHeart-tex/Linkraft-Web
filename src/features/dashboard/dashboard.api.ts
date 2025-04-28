import { GeneralStats } from '@/features/dashboard/dashboard.types';
import api from '@/lib/api/api';
import { ApiResponse } from '@/lib/api/api.types';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';

export const useGeneralStats = () =>
  useQuery({
    queryKey: [QUERY_KEYS.dashboard.getGeneralStats],
    queryFn: () =>
      safeApiCall(() =>
        api.get<ApiResponse<GeneralStats>>(API_ROUTES.dashboard.getGeneralStats)
      ).then((res) => res.data),
  });

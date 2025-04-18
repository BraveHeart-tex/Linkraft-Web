import api from '@/lib/api/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/lib/api/api.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { SessionValidationResult } from '../auth/auth.types';
import { safeApiCall } from '@/lib/api/safeApiCall';

export const useCurrentUser = () =>
  useQuery({
    queryFn: async () => {
      return safeApiCall(() =>
        api.get<ApiResponse<SessionValidationResult>>(
          API_ROUTES.auth.getCurrentUser
        )
      );
    },
    queryKey: [QUERY_KEYS.auth.getCurrentUser],
  });

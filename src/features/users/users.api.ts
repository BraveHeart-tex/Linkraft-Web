import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import { SessionValidationResult } from '../auth/auth.types';

export const useCurrentUser = () =>
  useQuery({
    queryFn: async () => {
      const response = await safeApiCall(() =>
        api.get<ApiResponse<SessionValidationResult>>(
          API_ROUTES.auth.getCurrentUser
        )
      );

      return response.data?.user;
    },
    queryKey: QUERY_KEYS.auth.currentUser(),
  });

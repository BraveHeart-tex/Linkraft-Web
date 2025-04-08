import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/lib/api.types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { SessionValidationResult } from '../auth/auth.types';

export const useCurrentUser = () =>
  useQuery({
    queryFn: async () => {
      const response = await api.get<ApiResponse<SessionValidationResult>>(
        API_ROUTES.auth.getCurrentUser
      );

      return response.data;
    },
    queryKey: [QUERY_KEYS.auth.getCurrentUser],
  });

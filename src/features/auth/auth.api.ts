import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { SignInDto, SignUpDto } from './auth.schema';
import { SessionValidationResult, SignInResponse } from './auth.types';
import { ApiResponse } from '@/lib/api.types';
import { QUERY_KEYS } from '@/lib/queryKeys';

export const useSignIn = (
  options?: UseMutationOptions<ApiResponse<SignInResponse>, unknown, SignInDto>
): UseMutationResult<ApiResponse<SignInResponse>, unknown, SignInDto> =>
  useMutation({
    mutationFn: async (data: SignInDto) => {
      const response = await api.post<ApiResponse<SignInResponse>>(
        API_ROUTES.auth.signIn,
        data
      );
      return response.data;
    },
    ...options,
  });

export const useSignUp = (
  options?: UseMutationOptions<ApiResponse<SignInResponse>, unknown, SignUpDto>
): UseMutationResult<ApiResponse<SignInResponse>, unknown, SignUpDto> =>
  useMutation({
    mutationFn: async (data: SignUpDto) => {
      const response = await api.post<ApiResponse<SignInResponse>>(
        API_ROUTES.auth.signUp,
        data
      );
      return response.data;
    },
    ...options,
  });

export const useCurrentUser = () =>
  useQuery({
    queryFn: async () => {
      const response = await api.get<ApiResponse<SessionValidationResult>>(
        API_ROUTES.auth.getCurrentUser
      );

      return response.data;
    },
    queryKey: [QUERY_KEYS.getCurrentUser],
  });

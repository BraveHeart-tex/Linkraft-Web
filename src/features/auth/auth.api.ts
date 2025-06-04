import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { SignInInput, SignUpInput } from './auth.schema';
import { SignInResponse } from './auth.types';

export const useSignIn = (
  options?: UseMutationOptions<
    ApiResponse<SignInResponse>,
    unknown,
    SignInInput
  >
): UseMutationResult<ApiResponse<SignInResponse>, unknown, SignInInput> =>
  useMutation({
    mutationFn: async (data: SignInInput) => {
      return safeApiCall(() =>
        api.post<ApiResponse<SignInResponse>>(API_ROUTES.auth.signIn, data)
      );
    },
    ...options,
  });

export const useSignUp = (
  options?: UseMutationOptions<
    ApiResponse<SignInResponse>,
    unknown,
    SignUpInput
  >
): UseMutationResult<ApiResponse<SignInResponse>, unknown, SignUpInput> =>
  useMutation({
    mutationFn: async (data: SignUpInput) => {
      return safeApiCall(() =>
        api.post<ApiResponse<SignInResponse>>(API_ROUTES.auth.signUp, data)
      );
    },
    ...options,
  });

export const useSignOut = (
  options?: UseMutationOptions<ApiResponse<null>, unknown, void>
): UseMutationResult<ApiResponse<null>, unknown, void> =>
  useMutation({
    mutationFn: async (): Promise<ApiResponse<null>> => {
      return safeApiCall(() =>
        api.post<ApiResponse<null>>(API_ROUTES.auth.signOut)
      );
    },
    ...options,
  });

import api from '@/lib/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { SignInDto, SignUpDto } from './auth.schema';
import { SignInResponse } from './auth.types';
import { ApiResponse } from '@/lib/api.types';

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

export const useSignOut = (
  options?: UseMutationOptions<ApiResponse<null>, unknown, void>
): UseMutationResult<ApiResponse<null>, unknown, void> =>
  useMutation({
    mutationFn: async (): Promise<ApiResponse<null>> => {
      const response = await api.post<ApiResponse<null>>(
        API_ROUTES.auth.signOut
      );
      return response.data;
    },
    ...options,
  });

import { SignInResponse } from '@/features/auth/auth.types';
import { AxiosError } from 'axios';

export interface SuccessApiResponse<T> {
  success: true;
  data: T;
  message: string;
  error: null;
}

export interface ErrorApiResponse {
  success: false;
  data: null;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = SuccessApiResponse<T> | ErrorApiResponse;

export type AxiosApiError = AxiosError<ApiResponse<SignInResponse>>;

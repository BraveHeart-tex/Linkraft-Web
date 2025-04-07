import { SignInResponse } from '@/features/auth/auth.types';
import { AxiosError } from 'axios';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
  error: null;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type AxiosApiError = AxiosError<ApiResponse<SignInResponse>>;

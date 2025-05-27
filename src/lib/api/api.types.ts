import { SignInResponse } from '@/features/auth/auth.types';
import { AxiosError } from 'axios';
import { StatusCodes } from 'http-status-codes';

type HttpStatusCode = (typeof StatusCodes)[keyof typeof StatusCodes];

export interface SuccessApiResponse<T> {
  success: true;
  data: T;
  message: string;
  error: null;
  status: HttpStatusCode;
}

export interface ErrorApiResponse {
  success: false;
  data: null;
  message: string;
  error: {
    details?: unknown;
  };
  status: HttpStatusCode;
}

export type ApiResponse<T> = SuccessApiResponse<T> | ErrorApiResponse;

export type AxiosApiError = AxiosError<ApiResponse<SignInResponse>>;

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

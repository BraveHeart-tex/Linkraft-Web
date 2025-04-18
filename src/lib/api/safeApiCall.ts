import { ErrorApiResponse } from '@/lib/api/api.types';
import axios from 'axios';

export async function safeApiCall<T>(
  apiFn: () => Promise<{ data: T }>
): Promise<T> {
  try {
    const response = await apiFn();
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ErrorApiResponse;
      throw apiError;
    }

    throw error;
  }
}

'use server';
import { ApiResponse } from '@/lib/api/api.types';
import { retryingApi } from '@/lib/api/apiClient';
import { API_ROUTES } from '@/routes/apiRoutes';
import { cookies } from 'next/headers';
import { SessionValidationResult } from './auth.types';

export const getCurrentUser = async (): Promise<SessionValidationResult> => {
  try {
    const cookieStore = await cookies();
    const response = await retryingApi.get<
      ApiResponse<SessionValidationResult>
    >(API_ROUTES.auth.getCurrentUser, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response structure');
    }

    const { user } = response.data.data;

    if (!user) {
      throw new Error('User not found in response');
    }

    return { user };
  } catch (error) {
    console.error('getCurrentUser error', error);
    return {
      user: null,
    };
  }
};

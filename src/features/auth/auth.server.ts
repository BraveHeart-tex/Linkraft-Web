'use server';
import api from '@/lib/api/api';
import { API_ROUTES } from '@/routes/apiRoutes';
import { SessionValidationResult } from './auth.types';
import { ApiResponse } from '@/lib/api/api.types';
import { cookies } from 'next/headers';
export const getCurrentUser = async (): Promise<SessionValidationResult> => {
  try {
    const cookieStore = await cookies();
    const response = await api.get<ApiResponse<SessionValidationResult>>(
      API_ROUTES.auth.getCurrentUser,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );

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

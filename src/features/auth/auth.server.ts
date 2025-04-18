/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
    const data = response.data.data;

    return {
      user: data?.user!,
    };
  } catch (error) {
    console.error('getCurrentUser error', error);
    return {
      user: null,
    };
  }
};

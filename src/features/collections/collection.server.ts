'use server';

import {
  Collection,
  CollectionWithBookmarks,
} from '@/features/collections/collection.types';
import { ApiResponse } from '@/lib/api/api.types';
import { isErrorApiResponse } from '@/lib/api/api.utils';
import { retryingApi } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { Nullable } from '@/lib/common.types';
import { API_ROUTES } from '@/routes/apiRoutes';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const getAccessibleCollectionById = async (
  collectionId: Collection['id']
): Promise<Nullable<CollectionWithBookmarks>> => {
  try {
    const cookieStore = await cookies();

    const response = await safeApiCall(() =>
      retryingApi.get<ApiResponse<CollectionWithBookmarks>>(
        API_ROUTES.collection.getAccessibleCollectionById(collectionId),
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      )
    );

    return response.data;
  } catch (error) {
    console.error('getAccessibleCollectionById error', error);

    if (
      isErrorApiResponse(error) &&
      error.status === StatusCodes.UNAUTHORIZED
    ) {
      redirect('/sign-in');
    }

    return null;
  }
};

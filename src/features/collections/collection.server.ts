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
  const cookieStore = await cookies();
  try {
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

    if (isErrorApiResponse(error)) {
      const status = error.status;

      if (status === StatusCodes.UNAUTHORIZED) {
        redirect('/sign-in');
      }

      if (status >= 500 && status < 600) {
        console.error('Internal server error while fetching collection');
        throw new Error(
          'Unexpected error occurred while fetching the collection'
        );
      }
    }

    console.error('Unexpected error while fetching collection');
    return null;
  }
};

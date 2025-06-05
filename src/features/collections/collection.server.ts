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
import { APP_ROUTES } from '@/routes/appRoutes';
import { StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CollectionWithBookmarkCount } from './collection.types';

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
        redirect(APP_ROUTES.signIn);
      }

      if (status >= 500 && status < 600) {
        console.error('Internal server error while fetching collection');
        throw new Error(
          'Unexpected error occurred while fetching the collection'
        );
      }
    }

    console.error('Unexpected error while fetching collection');
    throw error;
  }
};

export const getCollections = async (): Promise<
  CollectionWithBookmarkCount[]
> => {
  const cookieStore = await cookies();
  try {
    const response = await safeApiCall(() =>
      retryingApi.get<ApiResponse<{ items: CollectionWithBookmarkCount[] }>>(
        API_ROUTES.collection.getUserCollections(),
        {
          headers: {
            Cookie: cookieStore.toString(),
          },
        }
      )
    );

    return (response.data?.items || []).toSorted(
      (a, b) => a.displayOrder - b.displayOrder
    );
  } catch (error) {
    console.error('getCollections error', error);

    if (isErrorApiResponse(error)) {
      const status = error.status;

      if (status === StatusCodes.UNAUTHORIZED) {
        redirect(APP_ROUTES.signIn);
      }

      if (status >= 500 && status < 600) {
        console.error('Internal server error while fetching collection');
        throw new Error(
          'Unexpected error occurred while fetching the collection'
        );
      }
    }

    console.error('Unexpected error while fetching collection');
    return [];
  }
};

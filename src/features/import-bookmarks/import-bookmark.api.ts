import api from '@/lib/api/api';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

interface ImportBookmarkFileParams {
  formData: FormData;
  requestConfig?: AxiosRequestConfig;
}

export const useImportBookmarkFile = () =>
  useMutation({
    mutationFn: ({ formData, requestConfig }: ImportBookmarkFileParams) =>
      safeApiCall(() =>
        api.post(API_ROUTES.bookmark.importBookmarks, formData, requestConfig)
      ),
  });

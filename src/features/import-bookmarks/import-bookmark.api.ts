import { ApiResponse } from '@/lib/api/api.types';
import { api } from '@/lib/api/apiClient';
import { safeApiCall } from '@/lib/api/safeApiCall';
import { API_ROUTES } from '@/routes/apiRoutes';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';

interface ImportBookmarkFileParams {
  formData: FormData;
  requestConfig?: AxiosRequestConfig;
}

interface ImportBookmarkFileResponse {
  jobId: string;
}

export const useImportBookmarkFile = (
  options?: UseMutationOptions<
    ApiResponse<ImportBookmarkFileResponse>,
    unknown,
    ImportBookmarkFileParams
  >
) =>
  useMutation({
    mutationFn: ({ formData, requestConfig }: ImportBookmarkFileParams) =>
      safeApiCall(() =>
        api.post<ApiResponse<ImportBookmarkFileResponse>>(
          API_ROUTES.bookmark.importBookmarks,
          formData,
          requestConfig
        )
      ),
    ...options,
  });

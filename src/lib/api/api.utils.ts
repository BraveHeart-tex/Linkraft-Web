import { ErrorApiResponse } from '@/lib/api/api.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorApiResponse = (error: any): error is ErrorApiResponse => {
  return (
    typeof error === 'object' &&
    error !== null &&
    error.success === false &&
    typeof error.message === 'string' &&
    'error' in error
  );
};

import { InfiniteQueryData } from '@/lib/query/infinite/types';

export const flattenInfiniteData = <T>(
  data?: InfiniteQueryData<T> | undefined
): T[] => {
  return data?.pages.flatMap((page) => page.items) || [];
};

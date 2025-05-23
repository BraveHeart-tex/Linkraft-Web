import { InfiniteData } from '@tanstack/react-query';

export interface InfiniteDataPage<T, K = string | number | null> {
  items: T[];
  nextCursor: K | undefined;
}
export type InfiniteQueryData<T, K = string | number | null> = InfiniteData<
  InfiniteDataPage<T, K>
>;

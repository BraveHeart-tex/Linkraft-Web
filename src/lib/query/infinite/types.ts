import { InfiniteData } from '@tanstack/react-query';

export interface InfiniteDataPage<T> {
  items: T[];
  nextCursor: string | null | undefined;
}
export type InfiniteQueryData<T> = InfiniteData<InfiniteDataPage<T>>;

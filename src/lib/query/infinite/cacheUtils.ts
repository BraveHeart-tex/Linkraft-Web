import { InfiniteQueryData } from '@/lib/query/infinite/types';

export const addItemToInfiniteQueryData = () => {};

export const removeItemFromInfiniteQueryData = <T>(
  data: InfiniteQueryData<T> | undefined,
  predicate: (item: T) => boolean
): InfiniteQueryData<T> | undefined => {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.filter(predicate),
    })),
  };
};

export const updateItemInInfiniteQueryData = <T>(
  data: InfiniteQueryData<T> | undefined,
  options: {
    match: (item: T) => boolean;
    update: (item: T) => T;
  }
): InfiniteQueryData<T> | undefined => {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        options.match(item) ? options.update(item) : item
      ),
    })),
  };
};

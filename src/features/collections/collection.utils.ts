import {
  Collection,
  CollectionWithBookmarkCount,
  InfiniteCollectionsData,
} from '@/features/collections/collection.types';

export const updatePaginatedCollection = (
  data: InfiniteCollectionsData | undefined,
  collectionId: Collection['id'],
  updater: (
    collection: CollectionWithBookmarkCount
  ) => CollectionWithBookmarkCount
): InfiniteCollectionsData | undefined => {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      collections: page.collections.map((collection) =>
        collection.id === collectionId ? updater(collection) : collection
      ),
    })),
  };
};

export const filterInfiniteCollections = (
  oldData: InfiniteCollectionsData,
  predicate: (collection: CollectionWithBookmarkCount) => boolean
): InfiniteCollectionsData => {
  if (!oldData) return oldData;
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      collections: page.collections.filter(predicate),
    })),
  };
};

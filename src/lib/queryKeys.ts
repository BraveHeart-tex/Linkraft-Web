import { Collection } from '@/features/collections/collection.types';

export const QUERY_KEYS = {
  auth: {
    currentUser: () => ['auth', 'currentUser'] as const,
  },
  bookmarks: {
    list: () => ['bookmarks', 'list'] as const,
    byId: (id: string) => ['bookmarks', 'byId', id] as const,
    trashed: () => ['bookmarks', 'trashed'] as const,
  },
  collections: {
    list: (query?: string) =>
      query
        ? (['collections', 'list', query] as const)
        : (['collections', 'list'] as const),
    listBookmarks: (collectionId: Collection['id']) =>
      ['collections', 'listBookmarks', collectionId] as const,
  },
  dashboard: {
    generalStats: () => ['dashboard', 'generalStats'] as const,
  },
  tags: {
    list: () => ['tags', 'list'] as const,
  },
  search: {
    list: (query?: string) =>
      query
        ? (['search', 'list', query] as const)
        : (['search', 'list'] as const),
  },
};

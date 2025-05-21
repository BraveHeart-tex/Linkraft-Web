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
    list: () => ['collections', 'list'] as const,
    listBookmarks: (collectionId: number) =>
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

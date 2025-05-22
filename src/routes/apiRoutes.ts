import { Bookmark } from '@/features/bookmarks/bookmark.types';
import { Collection } from '@/features/collections/collection.types';

export const API_ROUTES = {
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signOut: '/auth/sign-out',
    getCurrentUser: '/auth/me',
  },
  bookmark: {
    getBookmarks: ({
      nextCursor,
      collectionId,
    }: {
      nextCursor: number;
      collectionId?: Collection['id'];
    }) =>
      `/bookmarks?cursor=${nextCursor}${collectionId ? `&collectionId=${collectionId}` : ''}`,
    createBookmark: '/bookmarks',
    updateBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    trashBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    getTrashedBookmarks: (cursor: number) =>
      `/bookmarks/trash?cursor=${cursor}`,
    permanentlyDeleteBookmark: (bookmarkId: Bookmark['id']) =>
      `/bookmarks/${bookmarkId}/permanent`,
    restoreBookmark: (bookmarkId: Bookmark['id']) =>
      `/bookmarks/${bookmarkId}/restore`,
    importBookmarks: '/import-bookmarks',
    getById: (id: Bookmark['id']) => `/bookmarks/${id}`,
    bulkTrashBookmarks: '/bookmarks/bulk',
    bulkDeleteBookmarks: '/bookmarks/bulk/permanent',
  },
  collection: {
    createCollection: '/collections',
    getUserCollections: (nextCursor: number, query?: string) =>
      `/collections?cursor=${nextCursor}${query ? `&search=${encodeURIComponent(query)}` : ''}`,
    deleteCollection: (collectionId: Collection['id']) =>
      `/collections/${collectionId}`,
    updateCollection: (collectionId: Collection['id']) =>
      `/collections/${collectionId}`,
    getAccessibleCollectionById: (collectionId: Collection['id']) =>
      `/collections/${collectionId}`,
  },
  dashboard: {
    getGeneralStats: '/stats',
  },
  tags: {
    getUserTags: '/tags',
  },
  search: {
    getSearchResults: '/search',
  },
} as const;

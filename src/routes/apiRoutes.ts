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
      nextCursor?: string;
      collectionId?: Collection['id'];
    }): string => {
      const params = new URLSearchParams();

      if (nextCursor) {
        params.set('cursor', nextCursor);
      }

      if (collectionId) {
        params.set('collectionId', collectionId);
      }

      const queryString = params.toString();
      return `/bookmarks${queryString ? `?${queryString}` : ''}`;
    },
    createBookmark: '/bookmarks',
    updateBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    trashBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    getTrashedBookmarks: (cursor: string) =>
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
    getUserCollections: (query?: string) => {
      const params = new URLSearchParams();
      if (query) {
        params.set('search', query);
      }
      const queryString = params.toString();
      return `/collections${queryString ? `?${queryString}` : ''}`;
    },
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

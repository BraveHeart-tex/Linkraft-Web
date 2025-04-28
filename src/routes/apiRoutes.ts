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
    getBookmarks: (cursor: number) => `/bookmarks?cursor=${cursor}`,
    createBookmark: '/bookmarks',
    updateBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    trashBookmark: (bookmarkId: Bookmark['id']) => `/bookmarks/${bookmarkId}`,
    getTrashedBookmarks: '/bookmarks/trash',
    permanentlyDeleteBookmark: (bookmarkId: Bookmark['id']) =>
      `/bookmarks/${bookmarkId}/permanent`,
    restoreBookmark: (bookmarkId: Bookmark['id']) =>
      `/bookmarks/${bookmarkId}/restore`,
    importBookmarks: '/import-bookmarks',
  },
  collection: {
    createCollection: '/collections',
    getUserCollections: '/collections',
    deleteCollection: (collectionId: Collection['id']) =>
      `/collections/${collectionId}`,
    updateCollection: (collectionId: Collection['id']) =>
      `/collections/${collectionId}`,
  },
  dashboard: {
    getGeneralStats: '/stats',
  },
  tags: {
    getUserTags: '/tags',
  },
} as const;

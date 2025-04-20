export const API_ROUTES = {
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signOut: '/auth/sign-out',
    getCurrentUser: '/auth/me',
  },
  collection: {
    createCollection: '/collections',
    getUserCollections: '/collections',
    deleteCollection: (collectionId: number) => `/collections/${collectionId}`,
    updateCollection: (collectionId: number) => `/collections/${collectionId}`,
  },
  bookmark: {
    createBookmark: '/bookmarks',
    getBookmarks: '/bookmarks',
    trashBookmark: (bookmarkId: number) => `/bookmarks/${bookmarkId}`,
    permanentlyDeleteBookmark: (bookmarkId: number) =>
      `/bookmarks/${bookmarkId}/permanent`,
    getTrashedBookmarks: '/bookmarks/trash',
  },
} as const;

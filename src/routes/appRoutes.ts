import { Collection } from '@/features/collections/collection.types';

export const APP_ROUTES = {
  home: '/',
  collection: (collectionId: Collection['id']) =>
    `/collections/${collectionId}`,
  allBookmarks: '/bookmarks',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

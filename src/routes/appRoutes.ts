import { Collection } from '@/features/collections/collection.types';

export const APP_ROUTES = {
  home: '/',
  collections: '/collections',
  collection(collectionId: Collection['id']) {
    return `${this.collections}/${collectionId}`;
  },
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const;

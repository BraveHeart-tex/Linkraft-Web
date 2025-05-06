export interface Collection {
  id: number;
  name: string;
  userId: number;
  description: string | null;
  createdAt: string;
  isDeleted: boolean;
  color: string;
}

export type CollectionWithBookmarkCount = Collection & {
  bookmarkCount: number;
};

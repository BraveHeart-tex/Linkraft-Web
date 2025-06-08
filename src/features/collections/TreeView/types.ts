import { ItemInstance } from '@headless-tree/core';

export interface CollectionNode {
  id: string;
  name: string;
  bookmarkCount: number;
  children: CollectionNode['id'][];
}

export type CollectionNodeInstance = ItemInstance<CollectionNode>;

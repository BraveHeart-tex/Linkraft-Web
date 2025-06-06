import { ItemInstance } from '@headless-tree/core';

export interface CollectionNode {
  id: string;
  name: string;
  bookmarkCount: number;
  children: CollectionNode[];
}

export type CollectionNodeInstance = ItemInstance<CollectionNode>;

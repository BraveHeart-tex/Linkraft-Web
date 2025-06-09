import { CollectionWithBookmarkCount } from '@/features/collections/collection.types';
import { CollectionNode } from '@/features/collections/TreeView/types';
import { mapCollectionsToNodes } from '@/features/collections/TreeView/utils';
import { create } from 'zustand';

type CollectionMap = Record<string, CollectionNode>;

interface CollectionTreeState {
  nodes: CollectionMap;
  initialize: (collections: CollectionWithBookmarkCount[]) => void;
  setNodes: (nodes: CollectionMap) => void;
}

export const useCollectionTreeStore = create<CollectionTreeState>((set) => ({
  nodes: {},
  setNodes: (nodes) => set({ nodes }),
  initialize: (collections) => {
    set({ nodes: mapCollectionsToNodes(collections) });
  },
}));

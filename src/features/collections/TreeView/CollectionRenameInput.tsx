'use client';
import { MAX_COLLECTION_TITLE_LENGTH } from '@/features/collections/collection.constants';
import { CollectionNodeInstance } from '@/features/collections/TreeView/types';

interface CollectionRenameInputProps {
  item: CollectionNodeInstance;
}

const CollectionRenameInput = ({ item }: CollectionRenameInputProps) => {
  return (
    <input
      {...item.getRenameInputProps()}
      className="w-full h-7 flex-1 border-b border-transparent focus:border-b-primary focus:outline-none"
      onFocus={(e) => e.currentTarget.select()}
      maxLength={MAX_COLLECTION_TITLE_LENGTH}
    />
  );
};

export default CollectionRenameInput;

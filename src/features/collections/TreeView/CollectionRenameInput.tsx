'use client';
import { MAX_COLLECTION_TITLE_LENGTH } from '@/features/collections/collection.constants';
import { CollectionNodeInstance } from '@/features/collections/TreeView/types';
import { useEffect, useRef } from 'react';

interface CollectionRenameInputProps {
  item: CollectionNodeInstance;
}

const CollectionRenameInput = ({ item }: CollectionRenameInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isRenaming = item.isRenaming();

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isRenaming]);

  return (
    <input
      className="w-full flex-1"
      ref={inputRef}
      type="text"
      defaultValue={item.getItemData().name}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
      onBlur={() => {}}
      maxLength={MAX_COLLECTION_TITLE_LENGTH}
      onKeyDown={() => {
        // TODO:
        // if (e.key === 'Escape') node.reset();
        // if (e.key === 'Enter') {
        //   const value = e.currentTarget.value;
        //   if (value && value.replaceAll(' ', '').length) {
        //     node.submit(e.currentTarget.value);
        //   } else {
        //     node.reset();
        //   }
        // }
      }}
    />
  );
};

export default CollectionRenameInput;

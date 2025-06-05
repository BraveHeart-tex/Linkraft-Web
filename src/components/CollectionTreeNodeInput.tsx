'use client';

import { CollectionNode } from '@/components/CollectionsTreeView';
import { MAX_COLLECTION_TITLE_LENGTH } from '@/features/collections/collection.constants';
import { useEffect, useRef } from 'react';
import { NodeApi } from 'react-arborist';

interface CollectionTreeNodeInputProps {
  node: NodeApi<CollectionNode>;
}

const CollectionTreeNodeInput = ({ node }: CollectionTreeNodeInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (node.isEditing) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [node.isEditing]);

  return (
    <input
      className="w-full flex-1"
      ref={inputRef}
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
      onBlur={() => {
        node.reset();
      }}
      maxLength={MAX_COLLECTION_TITLE_LENGTH}
      onKeyDown={(e) => {
        if (e.key === 'Escape') node.reset();
        if (e.key === 'Enter') {
          const value = e.currentTarget.value;
          if (value && value.replaceAll(' ', '').length) {
            node.submit(e.currentTarget.value);
          } else {
            node.reset();
          }
        }
      }}
    />
  );
};
export default CollectionTreeNodeInput;

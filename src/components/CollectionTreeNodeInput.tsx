'use client';

import { CollectionNode } from '@/components/CollectionsTreeView';
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
      ref={inputRef}
      autoFocus
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => {
        e.currentTarget.select();
      }}
      onBlur={() => {
        console.log('blurring input');
        node.reset();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') node.reset();
        if (e.key === 'Enter') node.submit(e.currentTarget.value);
      }}
    />
  );
};
export default CollectionTreeNodeInput;

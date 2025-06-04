'use client';

import { CollectionNode } from '@/components/CollectionsTreeView';
import { NodeApi } from 'react-arborist';

interface CollectionTreeNodeInputProps {
  node: NodeApi<CollectionNode>;
}

const CollectionTreeNodeInput = ({ node }: CollectionTreeNodeInputProps) => {
  return (
    <input
      autoFocus
      type="text"
      defaultValue={node.data.name}
      onFocus={(e) => e.currentTarget.select()}
      onBlur={() => {
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

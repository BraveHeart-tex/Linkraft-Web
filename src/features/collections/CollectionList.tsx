'use client';
import CollectionCardSkeleton from '@/components/CollectionCardSkeleton';
import ResourceList from '@/components/ui/resource-list';
import AddNewCollectionButton from '@/features/collections/AddNewCollectionButton';
import { useCollections } from '@/features/collections/collection.api';
import CollectionCard from '@/features/collections/CollectionCard';
import { FolderIcon } from 'lucide-react';

const CollectionList = () => {
  const { data: collections, isLoading, error } = useCollections();
  return (
    <ResourceList
      data={collections}
      isLoading={isLoading}
      error={error}
      renderItem={(collection) => (
        <CollectionCard collection={collection} key={collection.id} />
      )}
      keyExtractor={(item) => item.id.toString()}
      emptyMessage="No collections found - add one to get started"
      containerClasses="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4"
      errorTitle="Couldn't load collections"
      emptyIcon={<FolderIcon className="h-10 w-10 stroke-muted-foreground" />}
      renderSkeleton={CollectionCardSkeleton}
      emptyAction={{
        element: (
          <AddNewCollectionButton
            buttonProps={{
              size: 'sm',
              variant: 'outline',
              className: 'mt-4',
            }}
          />
        ),
      }}
    />
  );
};
export default CollectionList;

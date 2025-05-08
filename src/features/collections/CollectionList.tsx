'use client';
import CollectionCardSkeleton from '@/components/CollectionCardSkeleton';
import { Button } from '@/components/ui/Button';
import ResourceList from '@/components/ui/ResourceList';
import { useCollections } from '@/features/collections/collection.api';
import CollectionCard from '@/features/collections/CollectionCard';
import { useModalStore } from '@/lib/stores/ui/modalStore';
import { FolderIcon } from 'lucide-react';

const CollectionList = () => {
  const { data: collections, isLoading, error } = useCollections();
  const openModal = useModalStore((state) => state.openModal);

  const handleAddCollection = () => {
    openModal({
      type: 'create-collection',
    });
  };

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
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleAddCollection}
          >
            Add Collection
          </Button>
        ),
      }}
    />
  );
};
export default CollectionList;

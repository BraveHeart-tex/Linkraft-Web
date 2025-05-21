'use client';
import CollectionCardSkeleton from '@/components/CollectionCardSkeleton';
import { Button } from '@/components/ui/Button';
import VirtualizedResourceList from '@/components/ui/VirtualizedResourceList';
import { usePaginatedCollections } from '@/features/collections/collection.api';
import CollectionCard from '@/features/collections/CollectionCard';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { FolderIcon } from 'lucide-react';
import { useMemo } from 'react';

const CollectionList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
    error,
  } = usePaginatedCollections();

  const allCollections = useMemo(() => {
    return data?.pages.flatMap((page) => page.collections) ?? [];
  }, [data]);

  const openModal = useModalStore((state) => state.openModal);

  const handleAddCollection = () => {
    openModal({
      type: MODAL_TYPES.CREATE_COLLECTION,
    });
  };

  return (
    <div className="space-y-4">
      <VirtualizedResourceList
        data={allCollections}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
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
    </div>
  );
};
export default CollectionList;

'use client';
import CollectionCardSkeleton from '@/components/CollectionCardSkeleton';
import AddNewCollectionButton from '@/features/collections/AddNewCollectionButton';
import { useCollections } from '@/features/collections/collection.api';
import CollectionCard from '@/features/collections/CollectionCard';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { FolderIcon } from 'lucide-react';

const CollectionsPage = () => {
  const { data: collections, isLoading, isError } = useCollections();

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderIcon className="size-7" />
            <div className="">
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                Collections
              </h1>
              <p className="text-muted-foreground text-sm">
                Collections you own
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            <CollectionCardSkeleton />
            <CollectionCardSkeleton />
            <CollectionCardSkeleton />
          </div>
        ) : null}
        {!isLoading && isError ? (
          <div className="min-h-[60vh] flex items-center justify-center flex-col space-y-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              An Error Occurred
            </h3>
            <p className="text-muted-foreground">
              Please try again after refreshing the page
            </p>
          </div>
        ) : null}
        {collections && collections.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            {collections?.map((collection) => (
              <CollectionCard collection={collection} key={collection.id} />
            ))}
            <AddNewCollectionButton variant="complimentary" />
            <CollectionFormDialog shouldRegisterCustomListeners />
          </div>
        ) : null}
        {!isLoading && !isError && collections?.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center flex-col space-y-1">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No Collections Yet
            </h3>
            <p className="text-muted-foreground">
              Get started by adding a new collection
            </p>
            <div className="pt-1">
              <AddNewCollectionButton />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default CollectionsPage;

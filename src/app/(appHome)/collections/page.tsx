'use client';
import { useCollections } from '@/features/collections/collection.api';
import CollectionCard from '@/features/collections/CollectionCard';
import { FolderIcon } from 'lucide-react';

const CollectionsPage = () => {
  const { data, isLoading } = useCollections();
  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderIcon />
            <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Collections
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Collections you own</p>
        </div>
        {isLoading ? <div>Loading...</div> : null}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
          {data?.data?.map((collection) => (
            <CollectionCard collection={collection} key={collection.id} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderIcon />
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
              Other Collections
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Collections you&apos;re a member of
          </p>
        </div>
      </div>
    </main>
  );
};

export default CollectionsPage;

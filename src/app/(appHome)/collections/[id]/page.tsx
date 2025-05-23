import { getAccessibleCollectionById } from '@/features/collections/collection.server';
import CollectionBookmarksList from '@/features/collections/CollectionBookmarksList';
import CollectionPageActions from '@/features/collections/CollectionPageActions';
import { excludeKey } from '@/lib/objectUtils';
import { FolderIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

const CollectionDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: collectionId } = await params;

  const collection = await getAccessibleCollectionById(+collectionId);

  if (!collection) {
    notFound();
  }

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <FolderIcon className="size-7" />
            <div>
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                {collection.name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {collection.description}
              </p>
            </div>
          </div>
          <CollectionPageActions
            collection={excludeKey(collection, 'bookmarks')}
          />
        </div>
        <CollectionBookmarksList collection={collection} />
      </div>
    </main>
  );
};

export default CollectionDetailsPage;

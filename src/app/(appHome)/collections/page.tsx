import { getCurrentUser } from '@/features/auth/auth.server';
import CollectionList from '@/features/collections/CollectionList';
import { APP_ROUTES } from '@/routes/appRoutes';
import { FolderIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

const CollectionsPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect(APP_ROUTES.signIn);
  }

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
        <CollectionList />
      </div>
    </main>
  );
};

export default CollectionsPage;

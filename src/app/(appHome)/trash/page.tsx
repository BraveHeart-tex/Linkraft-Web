import SelectionControls from '@/components/SelectionControls';
import { SelectionProvider } from '@/context/SelectionContext';
import { getCurrentUser } from '@/features/auth/auth.server';
import TrashedBookmarkList from '@/features/bookmarks/trash/TrashedBookmarkList';
import { TrashIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

const TrashPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect('/sign-in');
  }

  return (
    <SelectionProvider>
      <main className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrashIcon className="size-7" />
              <div>
                <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                  Trash
                </h1>
                <p className="text-muted-foreground text-sm">
                  Items in Trash for over 30 days will be automatically deleted
                </p>
              </div>
            </div>
            <SelectionControls />
          </div>
          <TrashedBookmarkList />
        </div>
      </main>
    </SelectionProvider>
  );
};

export default TrashPage;

import { getCurrentUser } from '@/features/auth/auth.server';
import BookmarkList from '@/features/bookmarks/BookmarkList';
import { LinkIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

const BookmarksPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect('/sign-in');
  }

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <LinkIcon className="size-7" />
            <div className="">
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                All Bookmarks
              </h1>
              <p className="text-muted-foreground text-sm">
                Bookmarks from every Collection
              </p>
            </div>
          </div>
        </div>
        <BookmarkList />
      </div>
    </main>
  );
};

export default BookmarksPage;

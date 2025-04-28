import { getCurrentUser } from '@/features/auth/auth.server';
import { redirect } from 'next/navigation';

const PinnedBookmarksPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect('/sign-in');
  }

  return <div>PinnedBookmarksPage</div>;
};
export default PinnedBookmarksPage;

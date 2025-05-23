import { getCurrentUser } from '@/features/auth/auth.server';
import { APP_ROUTES } from '@/routes/appRoutes';
import { redirect } from 'next/navigation';

const PinnedBookmarksPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect(APP_ROUTES.signIn);
  }

  return <div>PinnedBookmarksPage</div>;
};
export default PinnedBookmarksPage;

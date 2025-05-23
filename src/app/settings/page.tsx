import { getCurrentUser } from '@/features/auth/auth.server';
import { APP_ROUTES } from '@/routes/appRoutes';
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect(APP_ROUTES.signIn);
  }

  return <main>SettingsPage</main>;
};

export default SettingsPage;

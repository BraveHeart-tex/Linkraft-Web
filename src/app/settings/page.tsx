import { getCurrentUser } from '@/features/auth/auth.server';
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  const requestValidationResult = await getCurrentUser();

  if (!requestValidationResult?.user) {
    redirect('/sign-in');
  }

  return <main>SettingsPage</main>;
};

export default SettingsPage;

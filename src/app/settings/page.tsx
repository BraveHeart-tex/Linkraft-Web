import { getCurrentUser } from '@/features/auth/auth.server';
import { redirect } from 'next/navigation';

const SettingsPage = async () => {
  const result = await getCurrentUser();

  if (!result.user) {
    redirect('/sign-in');
  }

  return <main>SettingsPage</main>;
};

export default SettingsPage;

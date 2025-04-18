import { getCurrentUser } from '@/features/auth/auth.server';
import DashboardPage from '@/features/dashboard/DashboardPage';
import { redirect } from 'next/navigation';

export default async function Home() {
  const result = await getCurrentUser();

  if (!result.user) {
    redirect('/sign-in');
  }

  return <DashboardPage />;
}

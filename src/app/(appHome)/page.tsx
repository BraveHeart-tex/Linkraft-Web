import { getCurrentUser } from '@/features/auth/auth.server';
import DashboardPage from '@/features/dashboard/DashboardPage';
import { APP_ROUTES } from '@/routes/appRoutes';
import { redirect } from 'next/navigation';

const Home = async () => {
  const result = await getCurrentUser();

  if (!result.user) {
    redirect(APP_ROUTES.signIn);
  }

  return <DashboardPage />;
};

export default Home;

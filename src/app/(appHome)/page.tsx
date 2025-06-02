import { getCurrentUser } from '@/features/auth/auth.server';
import { APP_ROUTES } from '@/routes/appRoutes';
import { redirect } from 'next/navigation';

const Home = async () => {
  const result = await getCurrentUser();

  if (!result.user) {
    redirect(APP_ROUTES.signIn);
  }

  redirect(APP_ROUTES.allBookmarks);
};

export default Home;

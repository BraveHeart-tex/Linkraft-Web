import { getCurrentUser } from '@/features/auth/auth.server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const result = await getCurrentUser();

  if (!result.session || !result.user) {
    redirect('/sign-in');
  }

  return <div>Home Page</div>;
}

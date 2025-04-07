import { getCurrentUser } from '@/features/auth/auth.server';
import SignUpForm from '@/features/auth/SignUpForm';
import { redirect } from 'next/navigation';

export default async function Home() {
  const result = await getCurrentUser();

  if (!result.session || !result.user) {
    redirect('/sign-in');
  }

  return (
    <div>
      <SignUpForm />
    </div>
  );
}

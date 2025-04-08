import { getCurrentUser } from '@/features/auth/auth.server';
import SignInForm from '@/features/auth/SignInForm';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const result = await getCurrentUser();

  if (result?.user) {
    redirect('/');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignInPage;

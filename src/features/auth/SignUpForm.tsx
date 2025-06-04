'use client';
import GoogleIcon from '@/components/GoogleIcon';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { showErrorToast } from '@/lib/toast';
import { APP_ROUTES } from '@/routes/appRoutes';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSignUp } from './auth.api';
import { SignUpInput, SignUpSchema } from './auth.schema';

const SignUpForm = () => {
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp({
    onError(error) {
      showErrorToast((error as ErrorApiResponse).message);
    },
    onSuccess(data) {
      toast.success(data.message);
      router.push(APP_ROUTES.home);
    },
  });

  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      visibleName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignUpInput) => {
    signUp(values);
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Linkraft</span>
                </div>
                <h1 className="text-xl font-bold">Welcome to Linkraft</h1>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link
                    href="/sign-in"
                    className="underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="visibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visible Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                loading={isPending}
              >
                {isPending ? 'Signing Up' : 'Sign Up'}
              </Button>
            </form>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <Button variant="outline" className="w-full" disabled={isPending}>
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;

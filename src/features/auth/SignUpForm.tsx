'use client';
import { useForm } from 'react-hook-form';
import { SignUpDto, SignUpSchema } from './auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GalleryVerticalEnd, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import GoogleIcon from '@/components/GoogleIcon';
import { useSignUp } from './auth.api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AxiosApiError } from '@/lib/api.types';

const SignUpForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useSignUp({
    onError(error) {
      const { response } = error as AxiosApiError;
      toast.error(response?.data.message);
    },
    onSuccess(data) {
      toast.success(data.message);
      router.push('/');
    },
  });

  const form = useForm<SignUpDto>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: SignUpDto) => {
    mutate(values);
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
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2Icon className="animate-spin" />}
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

'use client';

import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { AlertTriangle, ArrowLeft, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md text-center border-none shadow-none bg-background">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-muted p-6">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {error.message || 'Something Went Wrong'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We&apos;re sorry for the inconvenience. The error has been logged
            and we&apos;re working on it.
          </p>
          {error.digest && (
            <p className="text-xs mt-2 p-2 bg-muted rounded-md">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 w-full">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => reset()}
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="w-full gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

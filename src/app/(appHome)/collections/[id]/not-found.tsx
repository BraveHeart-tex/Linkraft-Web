'use client';

import { Button } from '@/components/ui/Button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { ArrowLeft, FileQuestion, Home } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Linkraft | 404',
  description: "It looks the page you're looking for doesn't exist.",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md text-center border-none shadow-none bg-background">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-muted p-6">
              <FileQuestion className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="border-t border-border my-4" />
          <p className="text-sm text-muted-foreground">
            You might have followed a broken link, mistyped the address, or the
            page may have been moved or deleted.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button asChild className="w-full gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

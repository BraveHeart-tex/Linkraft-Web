import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryClientProviders from '@/providers/QueryClientProviders';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Linkraft',
  description:
    'Linkraft is a powerful, AI-driven bookmark manager that helps you organize and manage your bookmarks effortlessly, with intelligent features that make access and control simpler than ever before.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <QueryClientProviders>
          {children}
          <Toaster closeButton richColors />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProviders>
      </body>
    </html>
  );
}

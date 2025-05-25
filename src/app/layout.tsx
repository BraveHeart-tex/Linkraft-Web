import ConfirmDialog from '@/components/ConfirmDialog';
import { Toaster } from '@/components/ui/Sonner';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import QueryClientProviders from '@/providers/QueryClientProviders';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Linkraft',
  description:
    'Linkraft is a powerful, AI-driven bookmark manager that helps you organize and manage your bookmarks effortlessly, with intelligent features that make access and control simpler than ever before.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProviders>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ConfirmDialog />
            <Toaster closeButton richColors />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProviders>
      </body>
    </html>
  );
};

export default RootLayout;

import AppSidebar from '@/components/AppSidebar';
import AppSidebarHeader from '@/components/AppSidebarHeader';
import ModalHost from '@/components/Modalhost';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SocketProvider from '@/context/SocketProvider';
import BookmarkImportProgress from '@/features/import-bookmarks/BookmarkImportProgress';
import { ImportSocketClient } from '@/features/import-bookmarks/BookmarkImportSocketClient';
import { cookies } from 'next/headers';

const AppLevelLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SocketProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <AppSidebarHeader />
          <ImportSocketClient />
          <main className="p-2 sm:p-4">{children}</main>
          <BookmarkImportProgress />
          <ModalHost />
        </SidebarInset>
      </SidebarProvider>
    </SocketProvider>
  );
};

export default AppLevelLayout;

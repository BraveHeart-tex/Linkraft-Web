import AppSidebar from '@/components/AppSidebar';
import AppSidebarHeader from '@/components/AppSidebarHeader';
import ModalHost from '@/components/Modalhost';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SocketProvider from '@/context/SocketProvider';

const AppLevelLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SocketProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppSidebarHeader />
          <main className="p-2 sm:p-4">{children}</main>
          <ModalHost />
        </SidebarInset>
      </SidebarProvider>
    </SocketProvider>
  );
};

export default AppLevelLayout;

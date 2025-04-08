import AppSidebar from '@/components/AppSidebar';
import AppSidebarHeader from '@/components/AppSidebarHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarHeader />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;

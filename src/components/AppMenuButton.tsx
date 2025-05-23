'use client';
import { AppMenuItem } from '@/components/AppMenu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/Sidebar';
import Link from 'next/link';

interface AppMenuButtonProps {
  link: AppMenuItem;
}

const AppMenuButton = ({ link }: AppMenuButtonProps) => {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuButton asChild onClick={() => setOpenMobile(false)}>
      <Link href={link.href} className="flex items-center gap-1">
        <link.icon className="w-4 h-4" />
        <span>{link.label}</span>
      </Link>
    </SidebarMenuButton>
  );
};

export default AppMenuButton;

'use client';
import AppMenuButton from '@/components/AppMenuButton';
import { SidebarMenuItem } from '@/components/ui/Sidebar';
import { LinkIcon, LucideIcon, TrashIcon } from 'lucide-react';

export interface AppMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const sidebarLinks: AppMenuItem[] = [
  {
    label: 'All Bookmarks',
    href: '/bookmarks',
    icon: LinkIcon,
  },
  {
    label: 'Trash',
    href: '/trash',
    icon: TrashIcon,
  },
];

const AppMenu = () => {
  return sidebarLinks.map((link) => (
    <SidebarMenuItem key={link.href}>
      <AppMenuButton link={link} />
    </SidebarMenuItem>
  ));
};

export default AppMenu;

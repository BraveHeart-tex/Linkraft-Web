'use client';
import AppMenuButton from '@/components/AppMenuButton';
import { SidebarMenuItem } from '@/components/ui/Sidebar';
import {
  FolderIcon,
  HomeIcon,
  LinkIcon,
  LucideIcon,
  PinIcon,
  TrashIcon,
} from 'lucide-react';

export interface AppMenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const sidebarLinks: AppMenuItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    label: 'Pinned Bookmarks',
    href: '/bookmarks/pinned',
    icon: PinIcon,
  },
  {
    label: 'Bookmarks',
    href: '/bookmarks',
    icon: LinkIcon,
  },
  {
    label: 'Collections',
    href: '/collections',
    icon: FolderIcon,
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

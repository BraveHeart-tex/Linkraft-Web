import SidebarSearchButton from '@/components/SidebarSearchButton';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
import {
  FolderIcon,
  HomeIcon,
  LinkIcon,
  PinIcon,
  TrashIcon,
} from 'lucide-react';
import Link from 'next/link';

const sidebarLinks = [
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

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="py-2">
          <SidebarGroupLabel>App</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarSearchButton />
              </SidebarMenuItem>
              {sidebarLinks.map((link) => (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton asChild>
                    <Link href={link.href} className="flex items-center gap-1">
                      <link.icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

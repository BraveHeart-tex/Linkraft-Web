import {
  FolderIcon,
  HomeIcon,
  LinkIcon,
  PinIcon,
  TrashIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import SidebarTagList from '@/components/SidebarTagList';
import SidebarCollectionsList from '@/components/SidebarCollectionList';

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
        <SidebarCollectionsList />
        <SidebarTagList />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

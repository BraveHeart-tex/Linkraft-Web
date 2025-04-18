'use client';
import {
  ChevronDown,
  FolderIcon,
  HomeIcon,
  LinkIcon,
  PinIcon,
  PlusIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useCollections } from '@/features/collections/collection.api';
import CollectionFormDialog from '@/features/collections/CollectionFormDialog';
import { useState } from 'react';
import Link from 'next/link';

const tags = [
  { name: 'advice', count: 2 },
  { name: 'apple', count: 1 },
  { name: 'finance', count: 1 },
  { name: 'fitness', count: 2 },
  { name: 'food', count: 3 },
  { name: 'gaming', count: 1 },
  { name: 'productivity', count: 3 },
  { name: 'software design', count: 1 },
  { name: 'studies', count: 4 },
  { name: 'theories', count: 1 },
  { name: 'virtual reality', count: 2 },
  { name: 'WFH', count: 1 },
  { name: 'work', count: 1 },
];

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
        {/* Tags section */}
        <Collapsible defaultOpen className="w-full group/collapsible">
          <SidebarGroup className="py-2">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded-md">
                <SidebarGroupLabel className="px-0">Tags</SidebarGroupLabel>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <SidebarGroupContent>
                <SidebarMenu>
                  {tags.map((tag) => (
                    <SidebarMenuItem key={tag.name}>
                      <SidebarMenuButton asChild>
                        <a href="#">
                          <span className="text-sky-400">#</span> {tag.name}
                        </a>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{tag.count}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  );
};

const SidebarCollectionsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: collections } = useCollections();

  if (!collections) return null;

  return (
    <>
      <Collapsible defaultOpen className="w-full group/collapsible">
        <SidebarGroup className="py-2">
          <CollapsibleTrigger
            className="w-full"
            onClick={(event) => {
              if (collections.length === 0) {
                setIsOpen(true);
                event.preventDefault();
              }
            }}
          >
            <div className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded-md">
              <SidebarGroupLabel className="px-0">
                Collections
              </SidebarGroupLabel>
              {collections.length > 0 ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              ) : (
                <PlusIcon className="w-4 h-4" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <SidebarGroupContent>
              <SidebarMenu>
                {collections.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <Link href={`/collections/${item.id}`}>{item.name}</Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{item.bookmarkCount}</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <CollectionFormDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default AppSidebar;

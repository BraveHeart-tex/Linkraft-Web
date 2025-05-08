'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
import { useCollections } from '@/features/collections/collection.api';
import { useModalStore } from '@/lib/stores/ui/modalStore';
import { ChevronDown, PlusIcon } from 'lucide-react';
import Link from 'next/link';

const SidebarCollectionsList = () => {
  const openModal = useModalStore((s) => s.openModal);
  const { data: collections } = useCollections();

  if (!collections) return null;

  const handleTriggerClick = (event: React.MouseEvent) => {
    if (collections.length === 0) {
      openModal({
        type: 'create-collection',
      });
      event.preventDefault();
    }
  };

  return (
    <>
      <Collapsible defaultOpen className="w-full group/collapsible">
        <SidebarGroup className="py-2">
          <CollapsibleTrigger className="w-full" onClick={handleTriggerClick}>
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
                  <SidebarMenuItem key={item.id}>
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
    </>
  );
};

export default SidebarCollectionsList;

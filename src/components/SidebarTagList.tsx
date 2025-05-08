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
import { useTags } from '@/features/tags/tag.api';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const SidebarTagList = () => {
  const { data: tags } = useTags();

  if (!tags) return null;

  return (
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
                    <Link href={`/tags/${tag.id}`}>
                      <span className="text-sky-600 text-base">#</span>{' '}
                      {tag.name}
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{tag.usageCount}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export default SidebarTagList;

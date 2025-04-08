import { ChevronDown } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

const collections = [
  { name: 'Documents', count: 5 },
  { name: 'Images', count: 12 },
  { name: 'Videos', count: 3 },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Collections section */}
        <Collapsible defaultOpen className="w-full group/collapsible">
          <SidebarGroup className="py-2">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded-md">
                <span className="text-sm font-medium">Collections</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <SidebarGroupContent>
                <SidebarMenu>
                  {collections.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild>
                        <a href="#">{item.name}</a>
                      </SidebarMenuButton>
                      {item.count !== null && (
                        <SidebarMenuBadge>{item.count}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Tags section */}
        <Collapsible defaultOpen className="w-full group/collapsible">
          <SidebarGroup className="py-2">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-sidebar-accent rounded-md">
                <span className="text-sm font-medium">Tags</span>
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

export default AppSidebar;

import AppMenu from '@/components/AppMenu';
import CollectionsTreeView from '@/components/CollectionsTreeView';
import SidebarSearchButton from '@/components/SidebarSearchButton';
import { Button } from '@/components/ui/Button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
import UserMenu from '@/features/users/UserMenu';
import { PlusIcon } from 'lucide-react';

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="gap-0">
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              <div className="flex items-center w-full justify-between gap-2 my-2">
                <SidebarMenuItem className="flex-1">
                  <UserMenu />
                </SidebarMenuItem>
                <Button size="icon" variant="ghost">
                  <PlusIcon />
                </Button>
              </div>
              <SidebarMenuItem>
                <SidebarSearchButton />
              </SidebarMenuItem>
              <AppMenu />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-4 py-1">
            Collections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <CollectionsTreeView />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

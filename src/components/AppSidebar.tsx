import AppMenu from '@/components/AppMenu';
import SidebarSearchButton from '@/components/SidebarSearchButton';
import { Button } from '@/components/ui/Button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/Sidebar';
import UserMenu from '@/features/users/UserMenu';
import { PlusIcon } from 'lucide-react';

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="py-2">
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="flex items-center w-full justify-between gap-4 my-2">
                <SidebarMenuItem>
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
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

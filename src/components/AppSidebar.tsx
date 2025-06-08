import AppMenu from '@/components/AppMenu';
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
import { getCollections } from '@/features/collections/collection.server';
import SimpleTreeview from '@/features/collections/TreeView/CollectionTreeView';
import UserMenu from '@/features/users/UserMenu';
import { QUERY_KEYS } from '@/lib/queryKeys';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

const AppSidebar = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.collections.list(),
    queryFn: getCollections,
  });

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
            <HydrationBoundary state={dehydrate(queryClient)}>
              <SimpleTreeview />
            </HydrationBoundary>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

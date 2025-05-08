import { Separator } from '@/components/ui/Separator';
import { SidebarTrigger } from '@/components/ui/Sidebar';
import UserMenu from '@/features/users/UserMenu';
import ColorModeToggle from './ColorModeToggle';
import NewActionsDropdown from './NewActionsDropdown';

const AppSidebarHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="w-full flex items-center gap-4 justify-end">
        <ColorModeToggle />
        <NewActionsDropdown />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppSidebarHeader;

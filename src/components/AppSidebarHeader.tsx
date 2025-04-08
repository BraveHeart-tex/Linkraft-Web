import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from './ui/input';
import UserMenu from '@/features/users/UserMenu';

const AppSidebarHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="w-full flex items-center justify-between gap-8">
        <Input type="text" placeholder="Search for links" className="w-xs" />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppSidebarHeader;

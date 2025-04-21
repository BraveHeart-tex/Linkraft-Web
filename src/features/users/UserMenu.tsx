'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from './users.api';
import { Button, buttonVariants } from '@/components/ui/button';
import { CogIcon, LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSignOut } from '../auth/auth.api';
import { showErrorToast } from '@/lib/toast';
import { AxiosApiError } from '@/lib/api/api.types';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const UserMenu = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const { mutate: signOut, isPending } = useSignOut({
    onSuccess() {
      router.push('/sign-in');
    },
    onError(error) {
      showErrorToast((error as AxiosApiError).message);
    },
  });

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          profilePicture={user?.profilePicture}
          visibleName={user?.visibleName}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{user?.visibleName}</span>
          <span className="text-muted-foreground">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                className: 'w-full justify-start',
              })
            )}
          >
            <CogIcon />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
            disabled={isPending}
          >
            <LogOutIcon />
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;

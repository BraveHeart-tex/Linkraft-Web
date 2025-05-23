'use client';
import { Button, buttonVariants } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { showErrorToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/routes/appRoutes';
import { CogIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignOut } from '../auth/auth.api';
import UserAvatar from './UserAvatar';
import { useCurrentUser } from './users.api';

const UserMenu = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const { mutate: signOut, isPending } = useSignOut({
    onSuccess() {
      router.push(APP_ROUTES.signIn);
    },
    onError(error) {
      showErrorToast((error as ErrorApiResponse)?.message);
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

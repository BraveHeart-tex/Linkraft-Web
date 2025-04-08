'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from './users.api';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSignOut } from '../auth/auth.api';
import { showErrorToast } from '@/lib/toast';
import { AxiosApiError } from '@/lib/api.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarFallback } from '@/lib/utils';

const UserMenu = () => {
  const router = useRouter();
  const { data } = useCurrentUser();

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
        <Avatar>
          <AvatarImage src={data?.data?.user?.profilePicture} />
          <AvatarFallback>
            {generateAvatarFallback(data?.data?.user?.visibleName as string)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{data?.data?.user?.visibleName}</span>
          <span className="text-muted-foreground">
            {data?.data?.user?.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="w-full"
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

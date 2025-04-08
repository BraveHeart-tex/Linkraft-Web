'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Collection } from './collection.types';
import { CalendarIcon, EllipsisIcon, LinkIcon } from 'lucide-react';
import { generateSubtleGradientFromHex } from '@/lib/colorUtils';
import { formatIsoDate } from '@/lib/dateUtils';
import UserAvatar from '../users/UserAvatar';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConfirmDialogStore } from '@/lib/stores/confirmDialogStore';

interface CollectionCardProps {
  collection: Collection & { bookmarkCount: number };
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const showConfirmDialog = useConfirmDialogStore(
    (state) => state.showConfirmDialog
  );
  const router = useRouter();

  const handleDeleteCollection = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    showConfirmDialog({
      title: 'Delete Collection',
      message: 'Are you sure you want to delete this collection?',
      onConfirm() {},
      primaryActionLabel: 'Delete',
      primaryButtonVariant: 'destructive',
      alertText:
        'Deleting this collection will permanently remove all its contents and revoke access for everyone',
    });
  };

  return (
    <Card
      className="overflow-hidden py-4 cursor-pointer shadow-lg hover:shadow-sm transition-all"
      style={{
        background: generateSubtleGradientFromHex(collection.color),
      }}
      onClick={() => router.push(`/collections/${collection.id}`)}
    >
      <CardContent className="p-4 py-1 space-y-14">
        <div className="flex items-center justify-between gap-4 w-full">
          <h3 className="scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight overflow-hidden truncate">
            {collection.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="grid w-max space-y-2 py-2"
              align="end"
            >
              <DropdownMenuItem
                className="justify-start"
                onClick={(event) => event.stopPropagation()}
                asChild
              >
                <Button variant="ghost">Edit Collection Info</Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteCollection}
                className="text-destructive justify-start"
                asChild
              >
                <Button variant="ghost">Delete Collection</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center w-full justify-between gap-8">
          {/* TODO: */}
          <UserAvatar
            profilePicture=""
            visibleName="Bora Karaca"
            avatarClassNames="shadow-sm"
          />
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <LinkIcon className="h-4 w-4" />
              <span className="font-bold">{collection.bookmarkCount}</span>
            </div>
            <div className="flex items-center gap-1 font-bold">
              <CalendarIcon className="h-4 w-4" />
              {formatIsoDate(collection.createdAt, 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;

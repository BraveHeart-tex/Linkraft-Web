'use client';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { EllipsisIcon } from 'lucide-react';

interface CollectionActionsProps {
  onEdit: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDelete: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CollectionActions = ({ onEdit, onDelete }: CollectionActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="grid w-max space-y-2 py-2" align="end">
        <DropdownMenuItem className="justify-start" onClick={onEdit} asChild>
          <Button variant="ghost">Edit Collection Info</Button>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive justify-start"
          asChild
        >
          <Button variant="ghost">Delete Collection</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollectionActions;

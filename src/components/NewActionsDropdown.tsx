'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  ChevronDown,
  FolderIcon,
  LinkIcon,
  Plus,
  UploadIcon,
} from 'lucide-react';
import { useModalStore } from '@/lib/stores/ui/modalStore';

const actions = [
  { icon: UploadIcon, label: 'Import from Browser', type: 'import-bookmarks' },
  { icon: LinkIcon, label: 'New Bookmark', type: 'create-bookmark' },
  { icon: FolderIcon, label: 'New Collection', type: 'create-collection' },
] as const;

const NewActionsDropdown = () => {
  const openModal = useModalStore((s) => s.openModal);

  const handleActionClick = (type: (typeof actions)[number]['type']) => {
    openModal({ type });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="px-1" size="sm">
          <div className="flex items-center gap-1">
            <Plus />
            <ChevronDown className="h-2 w-4 ml-auto" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max grid">
        {actions.map(({ icon: Icon, label, type }) => (
          <DropdownMenuItem
            key={type}
            onClick={handleActionClick.bind(null, type)}
          >
            <Icon />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewActionsDropdown;

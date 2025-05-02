'use client';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useModalStore } from '@/lib/stores/ui/modalStore';
import { SearchIcon } from 'lucide-react';

const SidebarSearchButton = () => {
  const openModal = useModalStore((s) => s.openModal);

  const handleSearchClick = () => {
    openModal({
      type: 'search',
    });
  };

  return (
    <SidebarMenuButton
      className="flex items-center gap-2"
      onClick={handleSearchClick}
    >
      <SearchIcon className="w-4 h-4" />
      <span>Search</span>
    </SidebarMenuButton>
  );
};

export default SidebarSearchButton;

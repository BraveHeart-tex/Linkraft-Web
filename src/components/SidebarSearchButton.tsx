'use client';
import { SidebarMenuButton } from '@/components/ui/Sidebar';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { SearchIcon } from 'lucide-react';

const SidebarSearchButton = () => {
  const openModal = useModalStore((s) => s.openModal);

  const handleSearchClick = () => {
    openModal({
      type: MODAL_TYPES.SEARCH,
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

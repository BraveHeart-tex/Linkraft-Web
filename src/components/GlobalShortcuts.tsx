'use client';
import { KEYS } from '@/features/search/search.constants';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { useModalStore } from '@/lib/stores/ui/modalStore';

const GlobalShortcuts = () => {
  const openModal = useModalStore((s) => s.openModal);
  const modal = useModalStore((s) => s.modal);

  useKeyboardShortcut(
    { key: KEYS.K, meta: true },
    () => {
      openModal({ type: 'search' });
    },
    { preventDefault: true, enabled: !modal }
  );

  return null;
};

export default GlobalShortcuts;

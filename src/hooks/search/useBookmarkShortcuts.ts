import { fetchBookmarkById } from '@/features/bookmarks/bookmark.api';
import { KEYS } from '@/features/search/search.constants';
import { SearchResult } from '@/features/search/search.types';
import { useBookmarkActions } from '@/hooks/bookmarks/useBookmarkActions';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { isErrorApiResponse } from '@/lib/api/api.utils';
import { Nullable } from '@/lib/common.types';
import { MODAL_TYPES, useModalStore } from '@/lib/stores/ui/modalStore';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface UseBookmarkShortcutsOptions {
  enabled: boolean;
  peekingItem: Nullable<SearchResult>;
}

export const useBookmarkShortcuts = ({
  enabled,
  peekingItem,
}: UseBookmarkShortcutsOptions) => {
  const isLoadingRef = useRef(false);
  const openModal = useModalStore((s) => s.openModal);
  // FIXME: This may not pass the collectionId in our case
  const { handleTrashBookmark } = useBookmarkActions();

  const handleDeleteBookmark = useCallback(() => {
    if (!peekingItem) return;
    handleTrashBookmark(peekingItem.id);
  }, [handleTrashBookmark, peekingItem]);

  const handleOpenBookmarkUrl = useCallback(() => {
    if (!peekingItem) return;
    window.open(peekingItem.url, '_blank');
  }, [peekingItem]);

  const handleCopyBookmarkUrl = useCallback(async () => {
    if (!peekingItem) return;
    try {
      await navigator.clipboard.writeText(peekingItem.url);
      toast.dismiss();
      showSuccessToast('URL copied to clipboard');
    } catch {
      toast.dismiss();
      showErrorToast('Failed to copy URL to clipboard');
    }
  }, [peekingItem]);

  const handleEditBookmark = useCallback(async () => {
    if (!peekingItem) return;
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      const bookmark = await fetchBookmarkById(peekingItem.id);
      if (!bookmark) {
        showErrorToast('Could not find bookmark', {
          description: 'Bookmark may have been deleted or is inaccessible.',
        });
        return;
      }

      openModal({
        type: MODAL_TYPES.EDIT_BOOKMARK,
        payload: { bookmark },
      });
    } catch (error) {
      if (isErrorApiResponse(error)) {
        showErrorToast('Failed to fetch bookmark.', {
          description: error.message || 'No additional information available.',
        });

        console.error('API Error:', error);
        if (error.error?.details) {
          console.error('Error Details:', error.error.details);
        }
      } else {
        showErrorToast(
          'An unexpected error occurred while fetching the bookmark data.',
          {
            description:
              error instanceof Error ? error.message : 'Unknown error',
          }
        );

        console.error('Unexpected Error:', error);
      }
    } finally {
      isLoadingRef.current = false;
    }
  }, [openModal, peekingItem]);

  useKeyboardShortcut({ key: KEYS.ENTER, meta: true }, handleOpenBookmarkUrl, {
    enabled,
    preventDefault: true,
    ignoreFormFields: false,
  });

  useKeyboardShortcut({ key: KEYS.L, meta: true }, handleCopyBookmarkUrl, {
    enabled,
    preventDefault: true,
    ignoreFormFields: false,
  });

  useKeyboardShortcut({ key: KEYS.E, meta: true }, handleEditBookmark, {
    enabled,
    preventDefault: true,
    ignoreFormFields: false,
  });

  useKeyboardShortcut(
    { key: KEYS.BACKSPACE, meta: true },
    handleDeleteBookmark,
    {
      enabled,
      preventDefault: true,
      ignoreFormFields: false,
    }
  );
};

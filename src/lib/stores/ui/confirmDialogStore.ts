import { ButtonVariant } from '@/components/ui/Button';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ShowConfirmDialogParams {
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onConfirm: () => void | Promise<unknown>;
  onDeny?: () => void | Promise<unknown>;
  primaryButtonVariant?: ButtonVariant;
  secondaryButtonVariant?: ButtonVariant;
  alertText?: string;
}

interface ConfirmDialogStoreState {
  visible: boolean;
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  loading: boolean;
  onConfirm: () => void | Promise<unknown>;
  onDeny: () => void | Promise<unknown>;
  onConfirmResult: unknown;
  onDenyResult: unknown;
  cleanupTimeoutId: ReturnType<typeof setTimeout> | null;
  callPrimaryAction: () => void;
  callSecondaryAction: () => void;
  showConfirmDialog: (params: ShowConfirmDialogParams) => void;
  cleanUp: () => void;
  primaryButtonVariant: ButtonVariant;
  secondaryButtonVariant: ButtonVariant;
  alertText: string;
}

export const useConfirmDialogStore = create<
  ConfirmDialogStoreState,
  [['zustand/devtools', never]]
>(
  devtools(
    (set, get) => ({
      visible: false,
      title: '',
      message: '',
      primaryActionLabel: '',
      secondaryActionLabel: '',
      loading: false,
      onConfirmResult: null,
      onDenyResult: null,
      primaryButtonVariant: 'default',
      secondaryButtonVariant: 'outline',
      alertText: '',
      cleanupTimeoutId: null,

      onConfirm: () => {},
      onDeny: () => {},

      callPrimaryAction: async () => {
        const { onConfirm } = get();
        if (!onConfirm) return;

        set({ loading: true });

        try {
          const result = await onConfirm();
          set({
            visible: false,
            loading: false,
            onConfirmResult: result,
          });
        } catch (err) {
          console.error('[ConfirmDialog] Primary action error:', err);
          set({ loading: false });
        }
      },

      callSecondaryAction: async () => {
        const { onDeny } = get();
        if (!onDeny) return;

        try {
          const result = await onDeny();
          set({
            visible: false,
            onDenyResult: result,
          });
        } catch (err) {
          console.error('[ConfirmDialog] Secondary action error:', err);
        }
      },

      showConfirmDialog: ({
        title,
        message,
        primaryActionLabel,
        onConfirm,
        onDeny = () => {},
        secondaryActionLabel = '',
        primaryButtonVariant = 'default',
        secondaryButtonVariant = 'outline',
        alertText = '',
      }) => {
        const { cleanupTimeoutId } = get();

        if (cleanupTimeoutId) {
          clearTimeout(cleanupTimeoutId);
          set({ cleanupTimeoutId: null });
        }

        set({
          visible: true,
          title,
          message,
          primaryActionLabel,
          secondaryActionLabel,
          onConfirm,
          onDeny,
          loading: false,
          onConfirmResult: null,
          onDenyResult: null,
          primaryButtonVariant,
          secondaryButtonVariant,
          alertText,
        });
      },

      cleanUp: () => {
        const { cleanupTimeoutId } = get();

        if (cleanupTimeoutId) {
          clearTimeout(cleanupTimeoutId);
        }

        set({
          visible: false,
          onConfirm: () => {},
          onDeny: () => {},
          onConfirmResult: null,
          onDenyResult: null,
          loading: false,
          primaryButtonVariant: 'default',
          secondaryButtonVariant: 'outline',
        });

        const timeoutId = setTimeout(() => {
          set({
            title: '',
            message: '',
            primaryActionLabel: '',
            secondaryActionLabel: '',
            alertText: '',
            cleanupTimeoutId: null,
          });
        }, 100);

        set({ cleanupTimeoutId: timeoutId });
      },
    }),
    {
      name: 'ConfirmDialogStore',
    }
  )
);

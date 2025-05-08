import { ButtonVariant } from '@/components/ui/Button';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ShowConfirmDialogParams {
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onConfirm: () => void;
  onDeny?: () => void;
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
  onConfirm: () => void;
  onDeny: () => void;
  onConfirmResult: unknown;
  onDenyResult: unknown;
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
      onConfirmResult: null,
      onDenyResult: null,
      loading: false,
      primaryButtonVariant: 'default',
      secondaryButtonVariant: 'outline',
      alertText: '',

      onConfirm: () => {},
      onDeny: () => {},

      callPrimaryAction: async () => {
        const { onConfirm } = get();
        if (!onConfirm) return;

        set((state) => ({ ...state, loading: true }));
        const actionResult = await onConfirm();

        set((state) => ({
          ...state,
          visible: false,
          loading: false,
          primaryActionResult: actionResult,
        }));
      },
      callSecondaryAction: async () => {
        const { onDeny } = get();
        if (!onDeny) return;
        const actionResult = await onDeny();

        set((state) => ({
          ...state,
          visible: false,
          secondaryActionResult: actionResult,
        }));
      },
      showConfirmDialog: ({
        title,
        message,
        primaryActionLabel,
        onConfirm,
        onDeny,
        secondaryActionLabel,
        primaryButtonVariant = 'default',
        secondaryButtonVariant = 'outline',
        alertText,
      }) => {
        set((state) => ({
          ...state,
          visible: true,
          title,
          message,
          primaryActionLabel,
          secondaryActionLabel,
          onConfirm,
          onDeny,
          primaryButtonVariant,
          secondaryButtonVariant,
          alertText,
        }));
      },
      cleanUp: () => {
        set((state) => ({
          ...state,
          visible: false,
          onConfirm: () => {},
          onDeny: () => {},
          onConfirmResult: null,
          onDenyResult: null,
          loading: false,
          primaryButtonVariant: 'default',
          secondaryButtonVariant: 'outline',
        }));

        setTimeout(() => {
          set((state) => ({
            ...state,
            title: '',
            message: '',
            primaryActionLabel: '',
            secondaryActionLabel: '',
            alertText: '',
          }));
        }, 100);
      },
    }),
    {
      name: 'ConfirmDialogStore',
    }
  )
);

import { ExternalToast, toast } from 'sonner';

type ToastId = number | string;

export const showErrorToast = (
  message: string | undefined,
  data?: ExternalToast
): ToastId => {
  return toast.error(message, data);
};
export const showSuccessToast = (
  message: string | undefined,
  data?: ExternalToast
): ToastId => {
  return toast.success(message, data);
};

export const showInfoToast = (
  message: string | undefined,
  data?: ExternalToast
): ToastId => {
  return toast.info(message, data);
};

export const dismissToast = (toastId: ToastId) => {
  return toast.dismiss(toastId);
};

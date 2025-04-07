import { ExternalToast, toast } from 'sonner';

export const showErrorToast = (
  message: string | undefined,
  data?: ExternalToast
) => {
  return toast.error(message, data);
};
export const showSuccessToast = (
  message: string | undefined,
  data?: ExternalToast
) => {
  return toast.success(message, data);
};

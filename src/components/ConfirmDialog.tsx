'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useConfirmDialogStore } from '@/lib/stores/ui/confirmDialogStore';
import { TriangleAlertIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Nullable } from '@/lib/common.types';

const ConfirmDialog = () => {
  const {
    visible,
    cleanUp,
    title,
    message,
    primaryActionLabel,
    secondaryActionLabel,
    callPrimaryAction,
    callSecondaryAction,
    loading,
    primaryButtonVariant,
    secondaryButtonVariant,
    alertText,
  } = useConfirmDialogStore((state) => state);
  const actionRef = useRef<Nullable<HTMLButtonElement>>(null);

  useEffect(() => {
    if (visible && actionRef?.current) {
      actionRef?.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (visible && event.key === 'Enter' && actionRef.current) {
        actionRef.current.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent onEscapeKeyDown={cleanUp} className="space-y-2">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle>{title} </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        {alertText ? (
          <Alert variant="destructive">
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{alertText}</AlertDescription>
          </Alert>
        ) : null}
        <AlertDialogFooter>
          <div className="flex items-center gap-1 self-end">
            <Button
              disabled={loading}
              variant={secondaryButtonVariant}
              onClick={() => {
                callSecondaryAction();
                cleanUp();
              }}
            >
              {secondaryActionLabel || 'Cancel'}
            </Button>
            {primaryActionLabel && (
              <Button
                className="order-1"
                variant={primaryButtonVariant}
                onClick={() => {
                  callPrimaryAction();
                }}
                disabled={loading}
                tabIndex={0}
                ref={actionRef}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;

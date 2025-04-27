'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CollectionFormDialog from './CollectionFormDialog';

interface AddNewCollectionButtonProps {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dialogProps?: React.ComponentProps<typeof CollectionFormDialog>;
}

const AddNewCollectionButton = ({
  label = 'Add Collection',
  icon,
  buttonProps,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  dialogProps = {},
}: AddNewCollectionButtonProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  return (
    <>
      <Button onClick={() => setOpen(true)} {...buttonProps}>
        {label}
        {icon && <span className="ml-2">{icon}</span>}
      </Button>

      <CollectionFormDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        {...dialogProps}
      />
    </>
  );
};

export default AddNewCollectionButton;

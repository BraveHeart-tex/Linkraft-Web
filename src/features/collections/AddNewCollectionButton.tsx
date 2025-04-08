'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import CollectionFormDialog from './CollectionFormDialog';
import { useState } from 'react';

interface AddNewCollectionButtonProps {
  variant?: 'default' | 'complimentary';
}

const AddNewCollectionButton = ({
  variant = 'default',
}: AddNewCollectionButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {variant === 'complimentary' ? (
        <Button
          variant="secondary"
          className="flex-col h-full font-semibold! text-lg hover:shadow-sm shadow-lg"
          onClick={() => setOpen(true)}
        >
          Add Collection
          <PlusIcon className="size-7" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)}>
          Add Collection
          <PlusIcon />
        </Button>
      )}
      <CollectionFormDialog isOpen={open} onOpenChange={setOpen} />
    </>
  );
};

export default AddNewCollectionButton;

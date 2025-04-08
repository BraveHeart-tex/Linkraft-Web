'use client';
import { useForm } from 'react-hook-form';
import {
  CreateCollectionDto,
  CreateCollectionSchema,
} from './collection.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ColorPicker from '@/components/ui/color-picker';
import { useCreateCollection } from './collection.api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { Loader2Icon } from 'lucide-react';
import { AxiosApiError } from '@/lib/api.types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { CollectionWithBookmarkCount } from './collection.types';

interface CollectionFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollectionFormDialog = ({
  isOpen,
  onOpenChange,
}: CollectionFormDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<CreateCollectionDto>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      color: '#ffc107',
      description: '',
      name: '',
    },
  });

  const { mutate: createCollection, isPending } = useCreateCollection({
    onSuccess(data) {
      if (!data?.data) return;
      queryClient.setQueryData<CollectionWithBookmarkCount[]>(
        [QUERY_KEYS.collections.getCollections],
        (old) => [...(old || []), { ...data.data, bookmarkCount: 0 }]
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.collections.getCollections],
      });
      showSuccessToast('Collection created successfully');
      onOpenChange(false);
      form.reset();
    },
    onError(error) {
      showErrorToast('Something went wrong while creating a collection', {
        description: (error as AxiosApiError).message,
      });
    },
  });

  const onSubmit = (values: CreateCollectionDto) => {
    createCollection(values);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) form.reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collection</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorPicker
                      color={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Creating
                  </>
                ) : (
                  'Create'
                )}{' '}
                Collection
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionFormDialog;

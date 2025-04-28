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
import { useCreateCollection, useUpdateCollection } from './collection.api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { Loader2Icon } from 'lucide-react';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { Collection, CollectionWithBookmarkCount } from './collection.types';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface CollectionFormDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Collection;
}

const CollectionFormDialog = ({
  isOpen,
  onOpenChange,
  initialData,
}: CollectionFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen);

  const queryClient = useQueryClient();
  const form = useForm<CreateCollectionDto>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      color: '#ffc107',
      description: '',
      name: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        color: initialData.color,
        description: initialData.description,
        id: initialData.id,
        name: initialData.name,
      });
    }
  }, [form, initialData]);

  const { mutate: createCollection, isPending: isCreatingCollection } =
    useCreateCollection({
      onSuccess(data) {
        if (!data?.data) return;
        queryClient.setQueryData<CollectionWithBookmarkCount[]>(
          [QUERY_KEYS.collections.getCollections],
          (old) => [...(old || []), { ...data.data, bookmarkCount: 0 }]
        );
        showSuccessToast('Collection created successfully');
        onOpenChange?.(false);
        form.reset();
      },
      onError(error) {
        const apiError = error as ErrorApiResponse;

        showErrorToast('Something went wrong while creating a collection', {
          description: apiError.message,
        });
      },
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.collections.getCollections],
        });
      },
    });
  const { mutate: updateCollection, isPending: isUpdatingCollection } =
    useUpdateCollection({
      async onMutate(variables) {
        const toastId = showSuccessToast('Collection edited successfully');

        await queryClient.cancelQueries({
          queryKey: [QUERY_KEYS.collections.getCollections],
        });

        const previousCollections = queryClient.getQueryData<
          CollectionWithBookmarkCount[]
        >([QUERY_KEYS.collections.getCollections]);

        if (!previousCollections) return;

        queryClient.setQueryData<CollectionWithBookmarkCount[]>(
          [QUERY_KEYS.collections.getCollections],
          (old) => {
            if (!old) return;
            return old.map((oldCollection) => {
              if (oldCollection.id === variables.id) {
                return {
                  ...oldCollection,
                  ...variables,
                };
              }

              return oldCollection;
            });
          }
        );

        setInternalOpen(false);
        form.reset(variables);

        return { previousCollections, toastId };
      },
      onError(error, _variables, context) {
        const apiError = error as ErrorApiResponse;

        queryClient.setQueryData(
          [QUERY_KEYS.collections.getCollections],
          context?.previousCollections
        );
        showErrorToast('Something went wrong while editing the collection', {
          description: apiError.message,
          id: context?.toastId,
        });
      },
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.collections.getCollections],
        });
      },
    });

  const isLoading = isCreatingCollection || isUpdatingCollection;
  const isUpdateMode = form.watch('id');

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setInternalOpen(open);
    onOpenChange?.(open);
    if (!open) form.reset();
  };

  const onSubmit = (values: CreateCollectionDto) => {
    if (isUpdateMode) {
      updateCollection({
        ...values,
        id: values.id!,
      });
    } else {
      createCollection(values);
    }
  };

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdateMode ? 'Update' : 'Add'} Collection
          </DialogTitle>
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
                    <Input {...field} placeholder="E.g. Watch Later" />
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
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="The purpose of this collection"
                    />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    {isUpdateMode ? 'Updating' : 'Creating'}
                  </>
                ) : isUpdateMode ? (
                  'Update'
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

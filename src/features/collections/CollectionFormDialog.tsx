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
import { AxiosApiError } from '@/lib/api.types';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { Collection, CollectionWithBookmarkCount } from './collection.types';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { addTypedCustomEventListener, CUSTOM_EVENT_KEYS } from '@/lib/utils';

interface CollectionFormDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shouldRegisterCustomListeners?: boolean;
}

const CollectionFormDialog = ({
  isOpen,
  onOpenChange,
  shouldRegisterCustomListeners = false,
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

  const { mutate: createCollection, isPending: isCreatingCollection } =
    useCreateCollection({
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
        onOpenChange?.(false);
        form.reset();
      },
      onError(error) {
        showErrorToast('Something went wrong while creating a collection', {
          description: (error as AxiosApiError).message,
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
        queryClient.setQueryData(
          [QUERY_KEYS.collections.getCollections],
          context?.previousCollections
        );
        showErrorToast('Something went wrong while editing the collection', {
          description: (error as AxiosApiError).message,
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
  const isEditMode = form.watch('id');

  useEffect(() => {
    setInternalOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (shouldRegisterCustomListeners) {
      const cleanup = addTypedCustomEventListener<Collection>(
        CUSTOM_EVENT_KEYS.OPEN_EDIT_COLLECTION_DIALOG,
        (event) => {
          form.reset(event.detail);
          setInternalOpen(true);
        }
      );

      return cleanup;
    }
  }, [shouldRegisterCustomListeners]);

  const handleOpenChange = (open: boolean) => {
    setInternalOpen(open);
    onOpenChange?.(open);
    if (!open) form.reset();
  };

  const onSubmit = (values: CreateCollectionDto) => {
    if (isEditMode) {
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
                    {isEditMode ? 'Editing' : 'Creating'}
                  </>
                ) : isEditMode ? (
                  'Edit'
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

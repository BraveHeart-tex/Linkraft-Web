'use client';
import { Button } from '@/components/ui/Button';
import ColorPicker from '@/components/ui/ColorPicker';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { InfiniteBookmarksData } from '@/features/bookmarks/bookmark.types';
import { ErrorApiResponse } from '@/lib/api/api.types';
import {
  addItemToInfiniteQueryData,
  updateItemInInfiniteQueryData,
} from '@/lib/query/infinite/cacheUtils';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCollection, useUpdateCollection } from './collection.api';
import {
  CreateCollectionDto,
  CreateCollectionSchema,
} from './collection.schema';
import { Collection, InfiniteCollectionsData } from './collection.types';

interface CollectionFormDialogProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: Collection;
  onUpdate?: () => void;
}

const CollectionFormDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onUpdate,
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

  useEffect(() => {
    if (initialData) {
      form.reset({
        color: initialData.color,
        description: initialData.description || '',
        id: initialData.id,
        name: initialData.name,
      });
    }
  }, [form, initialData]);

  const { mutate: createCollection, isPending: isCreatingCollection } =
    useCreateCollection({
      onSuccess(data) {
        if (!data?.data) return;
        queryClient.setQueryData<InfiniteCollectionsData>(
          QUERY_KEYS.collections.list(),
          (old) =>
            addItemToInfiniteQueryData(old, { ...data.data, bookmarkCount: 0 })
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
      async onSettled() {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collections.list(),
        });
      },
    });
  const { mutate: updateCollection, isPending: isUpdatingCollection } =
    useUpdateCollection({
      async onMutate(variables) {
        const toastId = showSuccessToast('Collection edited successfully');

        await queryClient.cancelQueries({
          queryKey: QUERY_KEYS.collections.list(),
        });

        const previousCollections =
          queryClient.getQueryData<InfiniteCollectionsData>(
            QUERY_KEYS.collections.list()
          );

        if (!previousCollections) return;

        queryClient.setQueryData<InfiniteCollectionsData>(
          QUERY_KEYS.collections.list(),
          (oldData) =>
            updateItemInInfiniteQueryData(oldData, {
              match: (item) => item.id === variables.id,
              update: (item) => ({
                ...item,
                ...variables,
              }),
            })
        );

        onOpenChange?.(false);
        form.reset(variables);

        return { previousCollections, toastId };
      },
      onSuccess(_, variables) {
        // User might be on the collection details page / listing bookmarks
        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.collections.listBookmarks(variables.id),
          (oldData) =>
            updateItemInInfiniteQueryData(oldData, {
              match: (item) => item.collectionId === variables.id,
              update: (item) => ({
                ...item,
                collection: item.collection
                  ? {
                      ...item.collection,
                      name:
                        variables?.name !== undefined
                          ? variables?.name
                          : item.collection?.name,
                    }
                  : item.collection,
              }),
            })
        );
        onOpenChange?.(false);
        onUpdate?.();
      },
      onError(error, _variables, context) {
        const apiError = error as ErrorApiResponse;

        queryClient.setQueryData(
          QUERY_KEYS.collections.list(),
          context?.previousCollections
        );
        showErrorToast('Something went wrong while editing the collection', {
          description: apiError.message,
          id: context?.toastId,
        });
      },
      async onSettled() {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.collections.list(),
        });
      },
    });

  const isLoading = isCreatingCollection || isUpdatingCollection;
  const isUpdateMode = form.watch('id');

  const handleOpenChange = (open: boolean) => {
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              <Button type="submit" disabled={isLoading} loading={isLoading}>
                {isLoading ? (
                  <>{isUpdateMode ? 'Updating' : 'Creating'}</>
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

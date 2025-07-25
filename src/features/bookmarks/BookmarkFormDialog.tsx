'use client';
import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { MultiSelect } from '@/components/ui/MultiSelect';
import { Textarea } from '@/components/ui/Textarea';
import {
  useCreateBookmark,
  useUpdateBookmark,
} from '@/features/bookmarks/bookmark.api';
import BookmarkCollectionSelector from '@/features/bookmarks/BookmarkCollectionSelector';
import {
  CollectionWithBookmarkCount,
  SlimCollection,
} from '@/features/collections/collection.types';
import { ErrorApiResponse } from '@/lib/api/api.types';
import {
  addItemToInfiniteQueryData,
  updateItemInInfiniteQueryData,
} from '@/lib/query/infinite/cacheUtils';
import { InfiniteQueryData } from '@/lib/query/infinite/types';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { parseTags } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTags } from '../tags/tag.api';
import { Tag } from '../tags/tag.types';
import { CreateBookmarkSchema } from './bookmark.schema';
import {
  Bookmark,
  CreateBookmarkInput,
  InfiniteBookmarksData,
} from './bookmark.types';

interface BookmarkFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Bookmark;
  preSelectedCollection?: SlimCollection;
}

const BookmarkFormDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  preSelectedCollection,
}: BookmarkFormDialogProps) => {
  const { data: tags } = useTags();
  const form = useForm<CreateBookmarkInput>({
    resolver: zodResolver(CreateBookmarkSchema),
    defaultValues: {
      description: '',
      title: '',
      url: '',
      collectionId: null,
      tags: [],
    },
  });

  useEffect(() => {
    if (preSelectedCollection) {
      form.setValue('collectionId', preSelectedCollection.id);
    }
  }, [preSelectedCollection, form]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        collectionId: initialData.collection?.id || null,
        description: initialData.description,
        title: initialData.title,
        url: initialData.url,
        existingTagIds:
          Array.isArray(tags) && tags.length > 0
            ? tags.map((tag) => tag.id)
            : [],
        tags:
          Array.isArray(initialData.tags) && initialData.tags.length > 0
            ? initialData.tags.map((tag) => ({
                __isNew__: false,
                label: tag.name,
                value: tag.id.toString(),
              }))
            : [],
      });
    }
  }, [form, initialData, tags]);

  const tagOptions = useMemo(() => {
    return tags?.map((tag) => ({
      label: tag.name,
      value: tag.id.toString(),
      __isNew__: false,
    }));
  }, [tags]);

  const queryClient = useQueryClient();
  const { mutate: updateBookmark, isPending: isUpdatingBookmark } =
    useUpdateBookmark({
      onMutate(variables) {
        const hasUrlChanged = variables.url !== initialData?.url;
        const hasTitleChanged = variables.title !== initialData?.title;
        const isPendingMetadata = hasUrlChanged && !hasTitleChanged;

        const previousBookmarks =
          queryClient.getQueryData<InfiniteBookmarksData>(
            QUERY_KEYS.bookmarks.list()
          );

        if (!previousBookmarks) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.list(),
          (old) =>
            updateItemInInfiniteQueryData(old, {
              match: (item) => item.id === variables.id,
              update: (item) => ({
                ...item,
                url: variables.url ?? item.url,
                title: isPendingMetadata
                  ? 'Fetching Title'
                  : (variables.title ?? item.title),
                description: variables.description ?? item.description,
                isMetadataPending: isPendingMetadata,
              }),
            })
        );

        return { previousBookmarks };
      },
      async onSuccess(data, variables) {
        if (!data) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.list(),
          (old) =>
            updateItemInInfiniteQueryData(old, {
              match: (item) => item.id === variables.id,
              update: (item) => ({
                ...data.updatedBookmark,
                title: item.title,
                faviconUrl: item.faviconUrl,
                isMetadataPending: item.isMetadataPending,
              }),
            })
        );

        queryClient.setQueryData<Tag[]>(QUERY_KEYS.tags.list(), (oldTags) => [
          ...(oldTags || []),
          ...data.createdTags.map((tag) => ({
            ...tag,
            usageCount: 1,
          })),
        ]);

        if (variables.collectionId !== initialData?.collection?.id) {
          const addedId = variables.collectionId;
          const removedId = initialData?.collection?.id;

          queryClient.setQueryData<
            InfiniteQueryData<CollectionWithBookmarkCount>
          >(QUERY_KEYS.collections.list(), (collections) =>
            updateItemInInfiniteQueryData(collections, {
              match: (item) => item.id === addedId || item.id === removedId,
              update: (item) => ({
                ...item,
                bookmarkCount:
                  item.bookmarkCount + (item.id === addedId ? 1 : -1),
              }),
            })
          );
        }

        showSuccessToast('Bookmark updated successfully');
        form.reset();
        onOpenChange(false);
      },
      async onError(error, _variables, context) {
        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.list(),
          context?.previousBookmarks
        );

        const apiError = error as ErrorApiResponse;
        showErrorToast('Something went wrong while updating the bookmark', {
          description: apiError.message,
        });
      },
      async onSettled() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.tags.list(),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.collections.list(),
          }),
        ]);
      },
    });
  const { mutate: createBookmark, isPending: isCreatingBookmark } =
    useCreateBookmark({
      onSuccess(response) {
        if (!response?.data) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.list(),
          (previousBookmarksData) =>
            addItemToInfiniteQueryData(previousBookmarksData, response.data)
        );
        showSuccessToast('Bookmark created successfully');
        onOpenChange(false);
        form.reset();
      },
      onError(error) {
        const apiError = error as ErrorApiResponse;

        showErrorToast('Something went wrong while creating a bookmark', {
          description: apiError.message,
        });
      },
      async onSettled() {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
        });
      },
    });

  const onSubmit = (values: CreateBookmarkInput) => {
    const { existingTagIds, newTags } = parseTags(values.tags);
    if (!values.id) {
      createBookmark({
        collectionId: values.collectionId,
        description: values.description,
        title: values.title,
        url: values.url,
        existingTagIds,
        newTags,
      });
    } else {
      updateBookmark({
        id: values.id,
        collectionId: values.collectionId,
        description: values.description,
        title: values.title,
        url: values.url,
        existingTagIds,
        newTags,
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Bookmark</DialogTitle>
          <DialogDescription>
            Use the form below to add a new bookmark
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="w-full grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. http://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="collectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <FormControl>
                      <BookmarkCollectionSelector
                        selectedCollectionId={field.value}
                        triggerRef={field.ref}
                        onSelect={field.onChange}
                        preSelectedCollection={
                          preSelectedCollection ||
                          initialData?.collection ||
                          undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      isCreatable
                      isClearable
                      value={field.value || []}
                      ref={field.ref}
                      onChange={(options) =>
                        field.onChange(
                          options.map((opt) => ({
                            ...opt,
                            __isNew__: false,
                          }))
                        )
                      }
                      onCreateOption={(value) => {
                        if (!value) return;
                        const newOption = {
                          label: value,
                          id: value,
                          value,
                          __isNew__: true,
                        };
                        field.onChange([...(field.value || []), newOption]);
                      }}
                      noOptionsMessage="No tags found"
                      options={tagOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Will be generated if left empty"
                      {...field}
                      value={field.value || ''}
                    />
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
                      placeholder="Notes, thoughts etc..."
                      {...field}
                      value={field.value || ''}
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
              <Button
                type="submit"
                disabled={isCreatingBookmark || isUpdatingBookmark}
              >
                {isCreatingBookmark
                  ? 'Creating Bookmark...'
                  : isUpdatingBookmark
                    ? 'Updating Bookmark...'
                    : initialData
                      ? 'Update Bookmark'
                      : 'Create Bookmark'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkFormDialog;

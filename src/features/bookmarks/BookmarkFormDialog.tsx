'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { Bookmark, CreateBookmarkDto } from './bookmark.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBookmarkSchema } from './bookmark.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ComboBox, ComboboxOption } from '@/components/ui/combobox';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useEffect, useMemo } from 'react';
import {
  useCreateBookmark,
  useUpdateBookmark,
} from '@/features/bookmarks/bookmark.api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { ErrorApiResponse } from '@/lib/api/api.types';
import { StatusCodes } from 'http-status-codes';
import { MultiSelect } from '@/components/ui/multi-select';
import { useCollections } from '../collections/collection.api';
import { parseTags } from '@/lib/utils';
import { useTags } from '../tags/tag.api';
import { ApiError } from 'next/dist/server/api-utils';
import { Tag } from '../tags/tag.types';
import { CollectionWithBookmarkCount } from '../collections/collection.types';

interface BookmarkFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Bookmark;
}

const BookmarkFormDialog = ({
  isOpen,
  onOpenChange,
  initialData,
}: BookmarkFormDialogProps) => {
  const { data: tags } = useTags();
  const form = useForm<CreateBookmarkDto>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      description: '',
      title: '',
      url: '',
      collectionId: null,
      tags: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      const { id, title, url, description, tags, collection } = initialData;
      form.reset({
        id,
        collectionId: collection?.id || null,
        description,
        title,
        url,
        existingTagIds: tags?.map((tag) => tag.id),
        tags: tags?.length
          ? tags?.map((tag) => ({
              __isNew__: false,
              label: tag.name,
              value: tag.id.toString(),
            }))
          : [],
      });
    }
  }, [form, initialData]);

  const { data: collections } = useCollections();
  const queryClient = useQueryClient();
  const { mutate: updateBookmark, isPending: isUpdatingBookmark } =
    useUpdateBookmark({
      onMutate(variables) {
        const hasUrlChanged = variables.url !== initialData?.url;
        const hasTitleChanged = variables.title !== initialData?.title;
        const isPendingMetadata = hasUrlChanged && !hasTitleChanged;

        const previousBookmarks =
          queryClient.getQueryData<Bookmark[]>([
            QUERY_KEYS.bookmarks.getBookmarks,
          ]) || [];

        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getBookmarks],
          (old) =>
            (old || []).map((oldBookmark) => {
              if (oldBookmark.id !== variables.id) return oldBookmark;

              return {
                ...oldBookmark,
                url: variables?.url || oldBookmark.url,
                title: isPendingMetadata
                  ? 'Fetching Title'
                  : variables?.title || oldBookmark.title,
                description: variables?.description ?? oldBookmark.description,
                isMetadataPending: isPendingMetadata,
              };
            })
        );

        return { previousBookmarks };
      },
      async onSuccess(data, variables) {
        if (!data) return;
        const { createdTags, updatedBookmark } = data;

        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getBookmarks],
          (old) =>
            (old || []).map((oldBookmark) =>
              oldBookmark.id === variables.id
                ? {
                    ...oldBookmark,
                    ...updatedBookmark,
                    title: oldBookmark.title,
                    faviconUrl: oldBookmark.faviconUrl,
                    isMetadataPending: oldBookmark.isMetadataPending,
                  }
                : oldBookmark
            )
        );

        queryClient.setQueryData<Tag[]>(
          [QUERY_KEYS.tags.getTags],
          (oldTags) => [
            ...(oldTags || []),
            ...createdTags.map((tag) => ({
              ...tag,
              usageCount: 1,
            })),
          ]
        );

        if (variables.collectionId !== initialData?.collection?.id) {
          queryClient.setQueryData<CollectionWithBookmarkCount[]>(
            [QUERY_KEYS.collections.getCollections],
            (oldCollections) =>
              oldCollections?.map((oldCollection) => ({
                ...oldCollection,
                bookmarkCount:
                  oldCollection.id === variables.collectionId
                    ? oldCollection.bookmarkCount + 1
                    : initialData?.collection?.id
                      ? oldCollection.bookmarkCount - 1
                      : oldCollection.bookmarkCount,
              }))
          );
        }

        showSuccessToast('Bookmark updated successfully');
        form.reset();
        onOpenChange(false);
      },
      async onError(error, _variables, context) {
        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getBookmarks],
          context?.previousBookmarks
        );

        const apiError = error as ApiError;
        showErrorToast('Something went wrong while updating the bookmark', {
          description: apiError.message,
        });
      },
      async onSettled() {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.tags.getTags],
          }),
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.collections.getCollections],
          }),
        ]);
      },
    });
  const { mutate: createBookmark, isPending: isCreatingBookmark } =
    useCreateBookmark({
      onSuccess(data) {
        if (!data?.data) return;
        queryClient.setQueryData<Bookmark[]>(
          [QUERY_KEYS.bookmarks.getBookmarks],
          (old) => [...(old || []), { ...data.data }]
        );
        showSuccessToast('Bookmark created successfully');
        onOpenChange(false);
        form.reset();
      },
      onError(error) {
        const apiError = error as ErrorApiResponse;

        switch (apiError.status) {
          case StatusCodes.CONFLICT: {
            const existing = (
              apiError.error.details as { bookmarkWithSameUrl: Bookmark }
            )?.bookmarkWithSameUrl;
            if (existing && typeof existing === 'object') {
              form.setError(
                'url',
                {
                  message: `There is already a bookmark with this URL ${existing.deletedAt ? 'in Trash' : ''}`,
                },
                {
                  shouldFocus: true,
                }
              );
            }
            break;
          }

          default:
            showErrorToast('Something went wrong while creating a bookmark', {
              description: apiError.message,
            });
            break;
        }
      },
      onSettled() {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.bookmarks.getBookmarks],
        });
      },
    });

  const collectionOptions: ComboboxOption[] = useMemo(() => {
    return [
      { label: 'Select an option', value: null },
      ...(collections || []).map<ComboboxOption>((collection) => ({
        label: collection.name,
        value: collection.id,
      })),
    ];
  }, [collections]);

  const onSubmit = (values: CreateBookmarkDto) => {
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
                      <ComboBox
                        options={collectionOptions}
                        onValueChange={(value) => {
                          field.onChange(value === null ? null : +value);
                        }}
                        value={field.value}
                        ref={field.ref}
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
                      options={tags?.map((tag) => ({
                        label: tag.name,
                        value: tag.id.toString(),
                        __isNew__: false,
                      }))}
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

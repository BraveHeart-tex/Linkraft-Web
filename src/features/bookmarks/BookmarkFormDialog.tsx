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
import {
  Bookmark,
  CreateBookmarkDto,
  InfiniteBookmarksData,
} from './bookmark.types';
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
import { Tag } from '../tags/tag.types';
import { CollectionWithBookmarkCount } from '../collections/collection.types';
import { updatePaginatedBookmark } from '@/features/bookmarks/bookmark.utils';

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
          Array.isArray(tags) && tags.length > 0
            ? tags.map((tag) => ({
                __isNew__: false,
                label: tag.name,
                value: tag.id.toString(),
              }))
            : [],
      });
    }
  }, [form, initialData, tags]);

  const { data: collections } = useCollections();
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
            old
              ? updatePaginatedBookmark(old, variables.id, (b) => ({
                  ...b,
                  url: variables.url ?? b.url,
                  title: isPendingMetadata
                    ? 'Fetching Title'
                    : (variables.title ?? b.title),
                  description: variables.description ?? b.description,
                  isMetadataPending: isPendingMetadata,
                }))
              : old
        );

        return { previousBookmarks };
      },
      async onSuccess(data, variables) {
        if (!data) return;

        queryClient.setQueryData<InfiniteBookmarksData>(
          QUERY_KEYS.bookmarks.list(),
          (old) =>
            old
              ? updatePaginatedBookmark(old, variables.id, (b) => ({
                  ...data.updatedBookmark,
                  title: b.title,
                  faviconUrl: b.faviconUrl,
                  isMetadataPending: b.isMetadataPending,
                }))
              : old
        );

        queryClient.setQueryData<Tag[]>(QUERY_KEYS.tags.list(), (oldTags) => [
          ...(oldTags || []),
          ...data.createdTags.map((tag) => ({
            ...tag,
            usageCount: 1,
          })),
        ]);

        if (variables.collectionId !== initialData?.collection?.id) {
          queryClient.setQueryData<CollectionWithBookmarkCount[]>(
            QUERY_KEYS.collections.list(),
            (collections) =>
              collections?.map((collection) => {
                if (collection.id === variables.collectionId) {
                  return {
                    ...collection,
                    bookmarkCount: collection.bookmarkCount + 1,
                  };
                }
                if (collection.id === initialData?.collection?.id) {
                  return {
                    ...collection,
                    bookmarkCount: collection.bookmarkCount - 1,
                  };
                }
                return collection;
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
            showErrorToast('Something went wrong while updating the bookmark', {
              description: apiError.message,
            });
            break;
        }
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
            previousBookmarksData
              ? {
                  ...previousBookmarksData,
                  pages: [
                    {
                      ...previousBookmarksData.pages[0],
                      bookmarks: [
                        response.data,
                        ...(previousBookmarksData.pages[0]?.bookmarks || []),
                      ],
                    },
                    ...previousBookmarksData.pages.slice(1),
                  ],
                }
              : previousBookmarksData
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
      async onSettled() {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.bookmarks.list(),
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

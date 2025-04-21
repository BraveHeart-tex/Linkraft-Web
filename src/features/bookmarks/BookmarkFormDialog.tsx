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
import { Collection } from '../collections/collection.types';
import { useMemo } from 'react';
import { useCreateBookmark } from '@/features/bookmarks/bookmark.api';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { ErrorApiResponse } from '@/lib/api/api.types';

interface BookmarkFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookmarkFormDialog = ({
  isOpen,
  onOpenChange,
}: BookmarkFormDialogProps) => {
  const form = useForm<CreateBookmarkDto>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      description: '',
      title: '',
      url: '',
      collectionId: null,
    },
  });

  const queryClient = useQueryClient();
  const collections = useMemo(
    () =>
      queryClient.getQueryData<Collection[]>([
        QUERY_KEYS.collections.getCollections,
      ]) || [],
    [queryClient]
  );

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

        // TODO: Use status codes instead of hard-coded strings
        switch (apiError.error.code) {
          case 'CONFLICT': {
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
      ...collections.map<ComboboxOption>((collection) => ({
        label: collection.name,
        value: collection.id,
      })),
    ];
  }, [collections]);

  const onSubmit = (values: CreateBookmarkDto) => {
    createBookmark(values);
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Will be generated if left empty"
                      {...field}
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
                    <Textarea placeholder="Notes, thoughts etc..." {...field} />
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
              <Button type="submit" disabled={isCreatingBookmark}>
                {isCreatingBookmark ? 'Creating' : 'Create'} Bookmark
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkFormDialog;

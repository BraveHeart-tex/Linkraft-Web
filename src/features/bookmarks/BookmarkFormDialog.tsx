import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { CreateBookmarkDto } from './bookmark.types';
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

interface BookmarkFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookmarkFormDialog = ({
  isOpen,
  onOpenChange,
}: BookmarkFormDialogProps) => {
  const queryClient = useQueryClient();
  const collections =
    queryClient.getQueryData<Collection[]>([
      QUERY_KEYS.collections.getCollections,
    ]) || [];

  const collectionOptions: ComboboxOption[] = useMemo(() => {
    return [
      { label: 'Select an option', value: null },
      ...collections.map<ComboboxOption>((collection) => ({
        label: collection.name,
        value: collection.id,
      })),
    ];
  }, [collections]);

  const form = useForm<CreateBookmarkDto>({
    resolver: zodResolver(createBookmarkSchema),
    defaultValues: {
      description: '',
      thumbnail: '',
      title: '',
      url: '',
      collectionId: null,
    },
  });

  const onSubmit = (values: CreateBookmarkDto) => {
    console.log(values);
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
          <DialogTitle>New Bookmark</DialogTitle>
          <DialogDescription>
            Use the form below to add a new bookmark
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      onValueChange={field.onChange}
                      value={field.value}
                      ref={field.ref}
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
            <Button type="submit">Create Bookmark</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookmarkFormDialog;

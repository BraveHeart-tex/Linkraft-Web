'use client';
import { QUERY_KEYS } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import {
  FolderIcon,
  HashIcon,
  HomeIcon,
  LinkIcon,
  LucideIcon,
  PinIcon,
} from 'lucide-react';
import { useBookmarks } from '../bookmarks/bookmark.api';
import { Bookmark } from '../bookmarks/bookmark.types';
import { useCollections } from '../collections/collection.api';
import { CollectionWithBookmarkCount } from '../collections/collection.types';
import DashboardMetricCard from './DashboardMetricCard';

const exampleTags = ['advice', 'tech', 'video', 'learning'];

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { data: bookmarks, isPending: isPendingBookmarks } = useBookmarks({
    initialData: queryClient.getQueryData<Bookmark[]>([
      QUERY_KEYS.bookmarks.getBookmarks,
    ]),
  });
  const { data: collections, isPending: isPendingCollections } = useCollections(
    {
      initialData: queryClient.getQueryData<CollectionWithBookmarkCount[]>([
        QUERY_KEYS.collections.getCollections,
      ]),
    }
  );

  const dashboardStats: {
    icon: LucideIcon;
    title: string;
    value: number;
  }[] = [
    {
      icon: LinkIcon,
      title: 'Bookmarks',
      value: bookmarks?.length || 0,
    },
    {
      icon: FolderIcon,
      title: 'Collections',
      value: collections?.length || 0,
    },
    {
      icon: HashIcon,
      title: 'Tags',
      value: exampleTags.length,
    },
    {
      icon: PinIcon,
      title: 'Pinned',
      // TODO:
      value: 0,
    },
  ];

  const isLoading = isPendingBookmarks || isPendingCollections;

  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <HomeIcon className="size-7" />
            <div className="">
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                A brief overview of your data
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
            Loading...
          </div>
        ) : null}
        {!isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <DashboardMetricCard key={stat.title} {...stat} />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default DashboardPage;

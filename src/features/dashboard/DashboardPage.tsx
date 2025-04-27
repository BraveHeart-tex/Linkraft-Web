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
import { useTags } from '../tags/tag.api';
import DashboardMetricCardSkeleton from './DashboardMetricCardSkeleton';

interface DashboardStatItem {
  icon: LucideIcon;
  title: string;
  value: number;
}

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
  const { data: tags, isPending: isPendingTags } = useTags({
    initialData: queryClient.getQueryData([QUERY_KEYS.tags.getTags]),
  });

  const dashboardStats: DashboardStatItem[] = [
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
      value: tags?.length || 0,
    },
    {
      icon: PinIcon,
      title: 'Pinned',
      // TODO:
      value: 0,
    },
  ];

  const isLoading = isPendingBookmarks || isPendingCollections || isPendingTags;

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: dashboardStats.length }).map((_, index) => (
                <DashboardMetricCardSkeleton key={index} />
              ))
            : dashboardStats.map((item) => (
                <DashboardMetricCard key={item.title} {...item} />
              ))}
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;

'use client';
import {
  FolderIcon,
  HashIcon,
  HomeIcon,
  LinkIcon,
  LucideIcon,
  PinIcon,
} from 'lucide-react';
import DashboardMetricCard from './DashboardMetricCard';
import DashboardMetricCardSkeleton from './DashboardMetricCardSkeleton';
import { useGeneralStats } from '@/features/dashboard/dashboard.api';

interface DashboardStatItem {
  icon: LucideIcon;
  title: string;
  value: number;
}

const DashboardPage = () => {
  const { data, isPending } = useGeneralStats();

  const dashboardStats: DashboardStatItem[] = [
    {
      icon: LinkIcon,
      title: 'Bookmarks',
      value: data?.bookmarkCount || 0,
    },
    {
      icon: FolderIcon,
      title: 'Collections',
      value: data?.collectionCount || 0,
    },
    {
      icon: HashIcon,
      title: 'Tags',
      value: data?.tagCount || 0,
    },
    {
      icon: PinIcon,
      title: 'Pinned',
      // TODO:
      value: 0,
    },
  ];

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
          {isPending
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

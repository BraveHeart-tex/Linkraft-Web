import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const DashboardMetricCardSkeleton = () => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md p-2">
      <CardContent className="rounded-lg px-2">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-primary/10 p-3">
            <Skeleton className="h-5 w-5 bg-primary/20" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default DashboardMetricCardSkeleton;

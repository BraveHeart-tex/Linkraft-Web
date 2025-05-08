import { Card, CardContent } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const BookmarkCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-2 mb-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4 mb-1.5" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="mb-2.5">
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};
export default BookmarkCardSkeleton;

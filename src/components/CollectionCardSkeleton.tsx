import { Card, CardContent } from '@/components/ui/card';

const CollectionCardSkeleton = () => {
  return (
    <Card className="overflow-hidden py-4">
      <CardContent className="p-4 py-1 space-y-14">
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="h-6 w-3/5 rounded-md bg-accent animate-pulse" />
        </div>
        <div className="flex items-center w-full justify-between gap-8">
          <div className="h-8 w-8 rounded-full bg-accent animate-pulse" />
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1 justify-end">
              <div className="h-4 w-6 rounded-md bg-accent animate-pulse" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-4 w-24 rounded-md bg-accent animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionCardSkeleton;

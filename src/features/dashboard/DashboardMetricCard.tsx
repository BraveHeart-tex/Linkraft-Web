import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface DashboardMetricCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
}

const DashboardMetricCard = ({
  icon: Icon,
  title,
  value,
}: DashboardMetricCardProps) => {
  return (
    <Card className={'overflow-hidden transition-all hover:shadow-md p-2'}>
      <CardContent className="rounded-lg px-2">
        <div className="flex items-center justify-between">
          <div className="rounded-xl bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col gap-1 items-end">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <span className="text-3xl font-semibold tracking-tight">
              {value}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;

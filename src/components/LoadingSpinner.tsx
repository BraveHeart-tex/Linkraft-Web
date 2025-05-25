import { cn } from '@/lib/utils';
import { Loader2Icon, LucideProps } from 'lucide-react';

const LoadingSpinner = ({ ...props }: LucideProps) => {
  return (
    <Loader2Icon
      {...props}
      className={cn('h-4 w-4 animate-spin', props.className)}
    />
  );
};

export default LoadingSpinner;

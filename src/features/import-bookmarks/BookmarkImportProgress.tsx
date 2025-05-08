'use client';
import { Progress } from '@/components/ui/Progress';
import { useImportBookmarkStore } from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';

const BookmarkImportProgress = () => {
  const progress = useImportBookmarkStore((s) => s.progress);
  const status = useImportBookmarkStore((s) => s.status);
  const importJobId = useImportBookmarkStore((s) => s.importJobId);

  return (
    <div
      aria-hidden={!importJobId}
      role="alert"
      data-state={status}
      className={cn(
        `fixed bottom-6 right-6 w-80 bg-background border border-border shadow-lg rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 opacity-0 translate-y-4 text-popover-foreground`,
        importJobId && progress && 'opacity-100 translate-y-0'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-muted-foreground font-medium',
          status === 'completed' && 'text-success'
        )}
      >
        {status === 'processing' && (
          <>
            <Loader2 className="animate-spin h-4 w-4" />
            Importing bookmarks...
          </>
        )}
        {status === 'completed' && (
          <>
            <CheckCircle className="h-4 w-4" />
            Import complete
          </>
        )}
      </div>
      {status === 'processing' && (
        <>
          <Progress value={progress} className="h-2 rounded-full" />
          <p className="text-xs text-muted-foreground">
            Processed {progress}% of bookmarks...
          </p>
        </>
      )}
      {status === 'completed' && (
        <p className="text-xs text-muted-foreground">
          All bookmarks have been imported successfully.
        </p>
      )}
    </div>
  );
};

export default BookmarkImportProgress;

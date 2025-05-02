'use client';

import { Progress } from '@/components/ui/progress';
import { useBookmarkImportStore } from '@/lib/stores/bookmark-import/useBookmarkImportStore';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';

const BookmarkImportProgress = () => {
  const progress = useBookmarkImportStore((s) => s.progress);
  const status = useBookmarkImportStore((s) => s.status);
  const importJobId = useBookmarkImportStore((s) => s.importJobId);

  return (
    <div
      aria-hidden={!importJobId}
      role="alert"
      data-state={status}
      className={cn(
        `fixed bottom-6 right-6 w-80 bg-background border border-muted shadow-lg rounded-xl p-4 flex flex-col gap-3 transition-all duration-300 opacity-0 translate-y-4`,
        importJobId && 'opacity-100 translate-y-0'
      )}
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
        {status === 'processing' && (
          <>
            <Loader2 className="animate-spin h-4 w-4" />
            Importing bookmarks...
          </>
        )}
        {status === 'completed' && (
          <>
            <CheckCircle className="h-4 w-4 text-success" />
            Import complete
          </>
        )}
      </div>
      <Progress value={progress} className="h-2 rounded-full" />
    </div>
  );
};

export default BookmarkImportProgress;

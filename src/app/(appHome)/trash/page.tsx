import { TrashIcon } from 'lucide-react';

const TrashPage = () => {
  return (
    <main className="space-y-8">
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <TrashIcon className="size-7" />
            <div className="">
              <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                Trash
              </h1>
              <p className="text-muted-foreground text-sm">
                Items in Trash for over 30 days will be automatically deleted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TrashPage;

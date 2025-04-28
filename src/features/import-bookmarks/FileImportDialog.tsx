'use client';
import { Button } from '@/components/ui/button';
import CircularProgress from '@/components/ui/circular-progress';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Maximum size for imported bookmark files (5 MiB)
const BOOKMARK_IMPORT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const FileImportDialog = ({ isOpen, onOpenChange }: FileImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle file drop and file input selection
  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setErrorMessage('');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/html': ['.html', '.htm'],
    },
    maxSize: BOOKMARK_IMPORT_MAX_FILE_SIZE_BYTES,
    onDrop,
    onDropRejected: () => {
      setErrorMessage(
        'Invalid file type or file is too large. Please upload a valid HTML file (max 5MB).'
      );
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Bookmarks</DialogTitle>
          <DialogDescription>
            Drag and drop your bookmark file (HTML) here or click to select a
            file.
          </DialogDescription>
        </DialogHeader>

        {isUploading ? (
          <div className="flex items-center justify-center flex-col">
            <CircularProgress
              value={progress}
              size={120}
              strokeWidth={10}
              showLabel
              labelClassName="text-xl font-bold"
              renderLabel={(progress) => `${progress}%`}
              className="stroke-secondary"
              progressClassName="stroke-primary"
            />
            <p className="text-center mt-2">Uploading...</p>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              className="border-2 border-dashed p-6 rounded-lg cursor-pointer dark:hover:bg-muted/20 hover:bg-muted transition-colors"
            >
              <input {...getInputProps()} />
              {!file ? (
                <>
                  <p className="text-center text-muted-foreground">
                    Drag and drop your bookmark file (HTML) here or click to
                    select.
                  </p>
                  {errorMessage && (
                    <p className="text-destructive text-center mt-2">
                      {errorMessage}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-center text-success">
                  {file.name} selected. Ready to upload.
                </p>
              )}
            </div>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="mt-4 w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileImportDialog;

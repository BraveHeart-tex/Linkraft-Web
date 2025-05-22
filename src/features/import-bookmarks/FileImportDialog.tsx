'use client';
import { Button } from '@/components/ui/Button';
import CircularProgress from '@/components/ui/CircularProgress';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { BOOKMARK_IMPORT_MAX_FILE_SIZE_BYTES } from '@/features/import-bookmarks/import-bookmark.constants';
import { useImportBookmarkStore } from '@/lib/stores/import-bookmarks/useBookmarkImportStore';
import { bytesToMib } from '@/lib/utils';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImportBookmarkFile } from './import-bookmark.api';

interface FileImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const FileImportDialog = ({ isOpen, onOpenChange }: FileImportDialogProps) => {
  const setImportJobId = useImportBookmarkStore(
    (state) => state.setImportJobId
  );
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: importBookmarkFile } = useImportBookmarkFile({
    onSuccess(response) {
      if (!response.data?.jobId) return;
      setIsUploading(false);
      setProgress(0);
      setImportJobId(response.data.jobId);
      setFile(null);
      setErrorMessage('');
      onOpenChange(false);
    },
  });

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
        `Invalid file type or file is too large. Please upload a valid HTML file (max ${bytesToMib(BOOKMARK_IMPORT_MAX_FILE_SIZE_BYTES)}MB).`
      );
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    importBookmarkFile({
      formData,
      requestConfig: {
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setProgress(percentCompleted);
        },
      },
    });
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

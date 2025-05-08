'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
  className?: string;
}

const ErrorDisplay = ({
  title = 'Error loading content',
  message = 'There was a problem loading the requested content. Please try again.',
  onRetry,
  fullPage = false,
  className = '',
}: ErrorDisplayProps) => {
  if (fullPage) {
    return (
      <div
        className={`flex items-center justify-center min-h-[200px] p-4 ${className}`}
      >
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">{message}</AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Try Again
            </Button>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <Card className={`border-destructive/20 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <h3 className="font-medium text-destructive">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
      {onRetry && (
        <CardFooter className="border-t border-border/50 px-6 py-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ErrorDisplay;

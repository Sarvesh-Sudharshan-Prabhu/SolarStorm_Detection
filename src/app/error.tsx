'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Header } from '@/components/layout/Header'; // Assuming you might want the header on error pages too

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageWrapper>
        <div className="flex flex-col items-center justify-center text-center py-10">
          <h2 className="text-3xl font-bold text-destructive mb-4">Oops! Something went wrong.</h2>
          <p className="mb-3 text-muted-foreground max-w-md">
            We encountered an unexpected issue while trying to load this page.
            You can try to refresh the page or click the button below.
          </p>
          {process.env.NODE_ENV === 'development' && error?.message && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-left max-w-xl w-full">
              <p className="font-semibold text-destructive mb-1">Error Details (Development Mode):</p>
              <p className="text-sm text-destructive-foreground whitespace-pre-wrap">{error.message}</p>
              {error.digest && <p className="text-xs mt-1">Digest: {error.digest}</p>}
              {error.stack && <pre className="mt-2 text-xs overflow-auto max-h-40 bg-card p-2 rounded">{error.stack}</pre>}
            </div>
          )}
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            variant="default"
            size="lg"
          >
            Try Again
          </Button>
        </div>
      </PageWrapper>
      <footer className="py-4 px-4 md:px-8 border-t border-border/50 mt-auto">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Solar Flare Forecaster - Error Page
        </div>
      </footer>
    </div>
  );
}

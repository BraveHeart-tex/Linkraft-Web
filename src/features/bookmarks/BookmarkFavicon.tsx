'use client';
import { env } from '@/env';
import { BookmarkIcon, LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import { PropsWithChildren, useMemo, useState } from 'react';

interface BookmarkFaviconProps {
  isMetadataPending: boolean;
  alt: string;
  faviconUrl: string | null;
}

const BookmarkFavicon = ({
  isMetadataPending,
  alt,
  faviconUrl,
}: BookmarkFaviconProps) => {
  const [isError, setIsError] = useState(false);

  const isValidUrl = useMemo(() => {
    try {
      return (
        faviconUrl &&
        new URL(env.NEXT_PUBLIC_IMAGE_CDN_URL).hostname ===
          new URL(faviconUrl).hostname
      );
    } catch {
      return false;
    }
  }, [faviconUrl]);

  if (isMetadataPending) {
    return (
      <BookmarkFaviconWrapper>
        <LoaderIcon className="text-muted-foreground animate-spin" />
      </BookmarkFaviconWrapper>
    );
  }

  if (isError || !faviconUrl || !isValidUrl) {
    return (
      <BookmarkFaviconWrapper>
        <BookmarkIcon className="w-8 h-8 rounded-md" />
      </BookmarkFaviconWrapper>
    );
  }

  return (
    <BookmarkFaviconWrapper>
      <Image
        src={faviconUrl}
        alt={alt}
        width={32}
        height={32}
        className="h-full w-full object-cover rounded-md dark:bg-card-foreground"
        loading="lazy"
        onError={() => {
          setIsError(true);
        }}
      />
    </BookmarkFaviconWrapper>
  );
};

const BookmarkFaviconWrapper = ({ children }: PropsWithChildren) => (
  <div className="h-8 w-8 overflow-hidden">{children}</div>
);

export default BookmarkFavicon;

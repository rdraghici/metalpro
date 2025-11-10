/**
 * LazyImage Component
 *
 * Image component with lazy loading, placeholder, and error handling
 * Improves performance by loading images only when they're in viewport
 */

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  showSkeleton?: boolean;
  skeletonClassName?: string;
  errorComponent?: React.ReactNode;
}

export function LazyImage({
  src,
  alt,
  fallback = '/placeholder.svg',
  aspectRatio,
  showSkeleton = true,
  skeletonClassName,
  errorComponent,
  className,
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    setImageSrc(null);

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading image when it enters viewport
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
  };

  // Aspect ratio classes
  const aspectRatioClass = aspectRatio
    ? {
        square: 'aspect-square',
        video: 'aspect-video',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-[4/3]',
      }[aspectRatio]
    : '';

  return (
    <div className={cn('relative overflow-hidden', aspectRatioClass, className)}>
      {/* Skeleton placeholder */}
      {isLoading && showSkeleton && (
        <Skeleton
          className={cn(
            'absolute inset-0 z-10',
            aspectRatioClass,
            skeletonClassName
          )}
        />
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          aspectRatioClass,
          className
        )}
        loading="lazy"
        {...props}
      />

      {/* Error state */}
      {hasError && errorComponent && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {errorComponent}
        </div>
      )}
    </div>
  );
}

/**
 * LazyBackground Component
 *
 * Div component with lazy-loaded background image
 */
interface LazyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  fallback?: string;
  showSkeleton?: boolean;
}

export function LazyBackground({
  src,
  fallback = '/placeholder.svg',
  showSkeleton = true,
  className,
  children,
  ...props
}: LazyBackgroundProps) {
  const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setBackgroundSrc(null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Preload image
            const img = new Image();
            img.src = src;

            img.onload = () => {
              setBackgroundSrc(src);
              setIsLoading(false);
            };

            img.onerror = () => {
              setBackgroundSrc(fallback);
              setIsLoading(false);
            };

            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, fallback]);

  return (
    <div
      ref={divRef}
      className={cn('relative', className)}
      style={{
        backgroundImage: backgroundSrc ? `url(${backgroundSrc})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      {...props}
    >
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 z-0" />
      )}
      {children}
    </div>
  );
}

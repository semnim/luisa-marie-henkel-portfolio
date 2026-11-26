'use client';

import { cloudinaryLoader, isCloudinaryUrl } from '@/lib/cloudinary-loader';
import { cn } from '@/lib/utils';
import Image, { getImageProps, type ImageProps } from 'next/image';
import * as React from 'react';

/** True once the image has loaded, including when it loaded before hydration. */
function useLoaded() {
  const [loaded, setLoaded] = React.useState(false);
  const ref = React.useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);
  return { loaded, ref, onLoad: () => setLoaded(true) };
}

const fadeClasses = (loaded: boolean) =>
  cn(
    'transition-opacity duration-700 motion-reduce:transition-none',
    loaded ? 'opacity-100' : 'opacity-0'
  );

/** Cloudinary images are resized by Cloudinary, everything else by Next. */
const delivery = (src: ImageProps['src']) =>
  isCloudinaryUrl(src) ? { loader: cloudinaryLoader, unoptimized: false } : {};

/** next/image that fades in instead of popping onto the dark background. */
export function FadeImage({ className, alt, ...props }: ImageProps) {
  const { loaded, ref, onLoad } = useLoaded();
  return (
    <Image
      {...props}
      {...delivery(props.src)}
      alt={alt}
      ref={ref}
      onLoad={onLoad}
      className={cn(fadeClasses(loaded), className)}
    />
  );
}

type Source = { src: string };

type ArtDirectedImageProps = {
  desktop: Source;
  mobile: Source;
  alt: string;
  className?: string;
  /** For images further down the page: load when they come near. */
  lazy?: boolean;
};

/**
 * Full-bleed hero with a different image below and above the md breakpoint.
 * A <picture> lets the browser fetch only the one that matches, where two
 * <img> elements toggled with CSS would download both.
 */
export function ArtDirectedImage({
  desktop,
  mobile,
  alt,
  className,
  lazy = false,
}: ArtDirectedImageProps) {
  const { loaded, ref, onLoad } = useLoaded();
  const common = { alt, fill: true, sizes: '100vw' } as const;
  const { props: desktopProps } = getImageProps({
    ...common,
    ...desktop,
    ...delivery(desktop.src),
  });
  const { props: mobileProps } = getImageProps({
    ...common,
    ...mobile,
    ...delivery(mobile.src),
  });

  return (
    <picture>
      <source
        media="(min-width: 768px)"
        srcSet={desktopProps.srcSet ?? desktopProps.src}
        sizes={desktopProps.srcSet ? '100vw' : undefined}
      />
      <img
        {...mobileProps}
        alt={alt}
        ref={ref}
        onLoad={onLoad}
        loading={lazy ? 'lazy' : 'eager'}
        fetchPriority={lazy ? undefined : 'high'}
        // An image above the fold shows as soon as it arrives. Fading it in
        // would hold it back until the page has hydrated, which is what the
        // Largest Contentful Paint then measures.
        className={cn(lazy && fadeClasses(loaded), className)}
      />
    </picture>
  );
}

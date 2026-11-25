'use client';

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

/** next/image that fades in instead of popping onto the dark background. */
export function FadeImage({ className, alt, ...props }: ImageProps) {
  const { loaded, ref, onLoad } = useLoaded();
  return (
    <Image
      {...props}
      alt={alt}
      ref={ref}
      onLoad={onLoad}
      className={cn(fadeClasses(loaded), className)}
    />
  );
}

type Source = { src: string; unoptimized?: boolean };

type ArtDirectedImageProps = {
  desktop: Source;
  mobile: Source;
  alt: string;
  className?: string;
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
}: ArtDirectedImageProps) {
  const { loaded, ref, onLoad } = useLoaded();
  const common = { alt, fill: true, sizes: '100vw' } as const;
  const { props: desktopProps } = getImageProps({ ...common, ...desktop });
  const { props: mobileProps } = getImageProps({ ...common, ...mobile });

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
        loading="eager"
        fetchPriority="high"
        className={cn(fadeClasses(loaded), className)}
      />
    </picture>
  );
}

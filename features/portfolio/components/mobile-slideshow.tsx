'use client';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-is-mobile';
import type { Image as ImageType } from '@/lib/schema';
import { cn } from '@/lib/utils';
import { FadeImage as Image } from '@/components/ui/fade-image';
import Link from 'next/link';
import React from 'react';

type ExtendedImage = ImageType & {
  href?: string;
  title?: string;
};
type ImageWithLink = ImageType & {
  title?: string;
  href: string;
};
type ImageWithTitle = ImageType & {
  title: string;
  href?: string;
};

type MobileSlideshowProps = {
  images: ExtendedImage[];
  withCount?: boolean;
  onImageClick?: (image: ExtendedImage) => void;
};

const withOverlay = (img: ExtendedImage): img is ImageWithTitle => {
  return img.title !== undefined;
};
const withLink = (img: ExtendedImage): img is ImageWithLink => {
  return img.href !== undefined;
};

export function MobileSlideshow({
  images,
  withCount = false,
  onImageClick,
}: MobileSlideshowProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const count = images.length;
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (images.length === 0) {
    return (
      <div className="md:hidden flex items-center justify-start h-dvh bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const desktopImages = images.filter(
    (img) => img.variant === 'desktop' || img.variant === 'both'
  );
  const mobileImages = images.filter(
    (img) => img.variant === 'mobile' || img.variant === 'both'
  );
  return (
    <div className="relative md:hidden flex flex-col justify-start max-h-dvh h-dvh">
      <Carousel
        className="flex-1 flex flex-col justify-center max-h-dvh h-dvh"
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {(isMobile ? mobileImages : desktopImages).map((img, index) => {
            const figure = (
              <figure className="flex flex-1 relative">
                <Image
                  src={img.imageUrl}
                  alt={img.altText || img.title || `Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  loading={index === 0 ? 'eager' : undefined}
                  className="object-cover lg:object-[50%_20%] xl:object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  unoptimized
                />
                {withOverlay(img) && (
                  <figcaption className="absolute inset-0 lg:hidden bottom-0 flex lg:group-hover:flex flex-col justify-start items-center h-full bg-linear-to-b from-black/50 to-transparent mb-auto">
                    <div className="h-full flex items-center justify-center flex-col text-center z-20">
                      <p className="text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading">
                        {img.title}
                      </p>
                    </div>
                  </figcaption>
                )}
              </figure>
            );

            const wrapperClassName =
              'group relative overflow-hidden flex shrink-0 w-full md:w-auto md:flex-1 h-dvh snap-start';
            if (withLink(img)) {
              return (
                <Link key={index} href={img.href} className={wrapperClassName}>
                  {figure}
                </Link>
              );
            }
            return (
              <button
                type="button"
                key={index}
                className={wrapperClassName}
                onClick={() => onImageClick?.(img)}
                aria-label={`Enlarge image ${index + 1}`}
              >
                {figure}
              </button>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {withCount && (
        <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-background/60 px-4 backdrop-blur-sm">
            <p className="text-sm tabular-nums" aria-live="polite">
              {current + 1} / {count}
            </p>
            {/* Dots stay usable up to a handful of images; beyond that the
                counter alone is clearer than a row of tiny targets. */}
            {count <= 8 && (
              <div className="flex">
                {images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className="flex h-11 w-6 items-center justify-center"
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === current}
                  >
                    <span
                      className={cn(
                        'h-2 rounded-full transition-all',
                        index === current
                          ? 'w-4 bg-foreground'
                          : 'w-2 bg-foreground/40'
                      )}
                    />
                  </button>
                ))}
              </div>
            )}
            {count > 8 && <span className="h-11" />}
          </div>
        </div>
      )}
    </div>
  );
}

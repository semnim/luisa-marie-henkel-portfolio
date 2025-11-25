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
import Image from 'next/image';
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
    <div className="relative md:hidden flex flex-col justify-start max-h-dvh h-dvh overscroll-none">
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
                  alt={`Image #${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
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
                key={index}
                className={wrapperClassName}
                onClick={() => onImageClick?.(img)}
              >
                {figure}
              </button>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {withCount && (
        <>
          <div className="text-center text-sm text-foreground pb-4 absolute inset-x-0 z-30 bottom-18">
            {current + 1} / {count}
          </div>

          <div className="absolute inset-x-0 bottom-16 flex justify-center gap-2 mt-4 pb-2  z-30">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === current
                    ? 'bg-foreground w-6'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === current}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

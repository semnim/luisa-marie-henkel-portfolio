'use client';

import { Image } from '@/components/image';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

type ProjectImage = {
  id: number;
  publicId: string;
  imageUrl: string;
  width: number | null;
  height: number | null;
};

type MobileSlideshowProps = {
  images: ProjectImage[];
  title: string;
};

export function MobileSlideshow({ images, title }: MobileSlideshowProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
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

  return (
    <div className="relative md:hidden flex flex-col justify-start max-h-[calc(100dvh-60px)] h-[calc(100dvh-60px)]">
      <Carousel
        className="flex-1 flex flex-col justify-center max-h-[calc(100dvh-60px)] h-[calc(100dvh-60px)]"
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {images.map((img, index) => (
            <CarouselItem
              key={img.id}
              className="flex items-center justify-center"
            >
              <div className="relative w-full h-dvh">
                <Image
                  loading="eager"
                  src={img.publicId}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="absolute inset-x-0 bottom-16 flex justify-center gap-2 mt-4 pb-2">
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

      {/* Image Counter */}
      <div className="text-center text-sm text-foreground pb-4 absolute inset-x-0 bottom-18">
        {current + 1} / {count}
      </div>
    </div>
  );
}

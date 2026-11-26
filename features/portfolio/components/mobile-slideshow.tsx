'use client';

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
} from '@/components/ui/carousel';
import { FadeImage as Image } from '@/components/ui/fade-image';
import type { Image as ImageType } from '@/lib/schema';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export type SlideshowImage = ImageType & {
  /** Makes the slide a link; without it the slide is a button. */
  href?: string;
  /** Shown large above the progress bar while the slide is current. */
  title?: string;
};

type MobileSlideshowProps = {
  images: SlideshowImage[];
  /** Accessible name of the carousel, e.g. "Featured projects". */
  label: string;
  /** Row above the title, e.g. a section heading and a link. */
  header?: React.ReactNode;
  onImageClick?: (image: SlideshowImage) => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Full-screen swipeable slideshow for phones. Every slideshow on the site
 * shares the same controls: a counter, a progress line and two arrows in the
 * bottom bar, clear of the screen edges.
 */
export function MobileSlideshow({
  images,
  label,
  header,
  onImageClick,
}: MobileSlideshowProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const count = images.length;

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  if (count === 0) return null;

  const title = images[current]?.title;
  const slideClassName =
    'relative block h-(--screen) w-full shrink-0 overflow-hidden -outline-offset-2';

  return (
    <div className="relative h-(--screen) md:hidden">
      <Carousel className="h-full" setApi={setApi} aria-label={label}>
        <CarouselContent className="ml-0 h-full">
          {images.map((img, index) => {
            const image = (
              <Image
                src={img.imageUrl}
                alt={img.altText || img.title || `Image ${index + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
              />
            );
            return img.href ? (
              <Link key={img.id} href={img.href} className={slideClassName}>
                {image}
              </Link>
            ) : (
              <button
                type="button"
                key={img.id}
                className={slideClassName}
                onClick={() => onImageClick?.(img)}
                aria-label={`Enlarge image ${index + 1}`}
              >
                {image}
              </button>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Swipes and taps pass through to the slide; only the controls and
          links in here take pointer events. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-black/85 via-black/45 to-transparent px-5 pt-32 pb-[calc(var(--bar-clearance)+0.75rem)]">
        {header}
        {title && (
          <p
            aria-live="polite"
            className="mt-3 text-3xl leading-tight font-light tracking-item-subheading uppercase"
          >
            {title}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4">
          <p className="text-xs tracking-item-subheading tabular-nums">
            <span className="sr-only">Image </span>
            {pad(current + 1)}
            <span className="text-foreground/50">
              <span aria-hidden> / </span>
              <span className="sr-only"> of </span>
              {pad(count)}
            </span>
          </p>
          <div aria-hidden className="h-px flex-1 bg-foreground/25">
            <div
              className="h-px bg-foreground transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${((current + 1) / count) * 100}%` }}
            />
          </div>
          <div className="pointer-events-auto -mr-3 flex">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              disabled={current === 0}
              aria-label="Previous image"
              className="flex size-11 items-center justify-center transition-opacity disabled:opacity-30"
            >
              <ArrowLeft aria-hidden className="size-5" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={current === count - 1}
              aria-label="Next image"
              className="flex size-11 items-center justify-center transition-opacity disabled:opacity-30"
            >
              <ArrowRight aria-hidden className="size-5" strokeWidth={1.25} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

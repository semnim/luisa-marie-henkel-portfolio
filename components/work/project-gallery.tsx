'use client';

import { Image } from '@/lib/schema';
import { MasonryGrid } from './masonry-grid';
import { MobileSlideshow } from './mobile-slideshow';

type ProjectGalleryProps = {
  images: Image[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  return (
    <section className="snap-start h-[calc(100dvh-60px)] md:h-auto md:mt-12">
      <MobileSlideshow images={images} withCount />
      <MasonryGrid images={images} />
    </section>
  );
}

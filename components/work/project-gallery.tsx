'use client';

import { MasonryGrid } from './masonry-grid';
import { MobileSlideshow } from './mobile-slideshow';

type ProjectImage = {
  id: number;
  publicId: string;
  imageUrl: string;
  mobilePublicId?: string | null;
  mobileImageUrl?: string | null;
  width: number | null;
  height: number | null;
  linkTo?: string;
};

type ProjectGalleryProps = {
  images: ProjectImage[];
  title: string;
};

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  return (
    <section className="snap-start h-[calc(100dvh-60px)] md:h-auto md:mt-12">
      <MobileSlideshow images={images} title={title} />
      <MasonryGrid images={images} title={title} />
    </section>
  );
}

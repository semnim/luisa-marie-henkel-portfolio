'use client';

import { Image } from '@/lib/schema';
import { useState } from 'react';
import { ImageOverlay } from './image-overlay';
import { MasonryGrid } from './masonry-grid';
import { MobileSlideshow } from './mobile-slideshow';

type ProjectGalleryProps = {
  images: Image[];
};

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <section className="snap-start h-[calc(100dvh-60px)] md:h-auto md:mt-12">
      <MobileSlideshow
        images={images}
        withCount
        onImageClick={setSelectedImage}
      />
      <MasonryGrid images={images} onImageClick={setSelectedImage} />

      <ImageOverlay
        imageUrl={selectedImage?.imageUrl || ''}
        alt={selectedImage?.altText || 'Gallery image'}
        width={selectedImage?.width || null}
        height={selectedImage?.height || null}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}

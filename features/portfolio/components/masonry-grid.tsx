'use client';

import { Image as ImageType } from '@/lib/schema';
import { createSlugFromProjectTitle } from '@/lib/utils';
import { FadeImage as Image } from '@/components/ui/fade-image';
import Link from 'next/link';

type MasonryGridProps = {
  images: (ImageType | (ImageType & { title: string }))[];
  onImageClick?: (image: ImageType) => void;
};

export function MasonryGrid({ images, onImageClick }: MasonryGridProps) {
  if (images.length === 0) {
    return (
      <div className="hidden md:flex items-center justify-center min-h-[400px] bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block columns-2 lg:columns-3 gap-0 relative pt-0">
      {images.map((img, index) => {
        const content = (
          <figure className="break-inside-avoid p-1 group cursor-pointer">
            <div className="relative overflow-hidden">
              <Image
                sizes="(max-width: 1023px) 50vw, 34vw"
                src={img.imageUrl}
                alt={
                  img.altText ||
                  ('title' in img && img.title
                    ? img.title
                    : `Gallery image ${index + 1}`)
                }
                width={img.width || 800}
                height={img.height || 1200}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {'title' in img && img.title && (
                <figcaption className="absolute inset-x-0 bottom-0 lg:hidden flex lg:group-hover:flex flex-col justify-start items-center bg-linear-to-t from-black/75 to-transparent mb-auto">
                  <div className="text-center z-20 pb-8">
                    <p className="text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading">
                      {img.title}
                    </p>
                  </div>
                </figcaption>
              )}
            </div>
          </figure>
        );

        if ('title' in img && img.title) {
          return (
            <Link
              href={`/portfolio/${createSlugFromProjectTitle(img.title)}`}
              key={img.id}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            type="button"
            key={img.id}
            onClick={() => onImageClick?.(img)}
            aria-label={`Enlarge image ${index + 1}`}
            className="w-full text-left outline-none focus-visible:outline focus-visible:outline-foreground"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

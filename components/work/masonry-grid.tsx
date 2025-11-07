'use client';

import { Image } from '@/components/image';
import { createSlugFromProjectTitle } from '@/lib/utils';
import Link from 'next/link';
import { Heading } from '../heading';

type ProjectImage = {
  id: number;
  publicId: string;
  imageUrl: string;
  width: number | null;
  height: number | null;
  title?: string;
};

type MasonryGridProps = {
  images: ProjectImage[];
  title: string;
};

export function MasonryGrid({ images, title }: MasonryGridProps) {
  if (images.length === 0) {
    return (
      <div className="hidden md:flex items-center justify-center min-h-[400px] bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block columns-2 lg:columns-3 gap-4 relative">
      <div className="absolute bottom-0 inset-x-0 h-[200px] z-20 mask-t-from-1% bg-radial from-100% from-background to-99% to-transparent" />
      {images.map((img, index) => (
        <Link
          href={
            img.title ? `/work/${createSlugFromProjectTitle(img.title)}` : ''
          }
          key={img.id}
          className={` group overflow-hidden snap-center relative h-dvh lg:h-[500px]`}
        >
          <figure
            key={img.id}
            className="break-inside-avoid mb-4 group cursor-pointer"
          >
            <div className="relative overflow-hidden">
              <Image
                src={img.publicId}
                alt={`${title} - Image ${index + 1}`}
                width={img.width || 800}
                height={img.height || 1200}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {img.title && (
                <figcaption className="absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-start items-center h-50 bg-linear-to-b from-black/75 to-transparent mb-auto">
                  <Heading
                    variant="ITEM"
                    title={img.title}
                    containerClassName="pt-4 lg:pt-8 "
                  />
                </figcaption>
              )}
            </div>
          </figure>
        </Link>
      ))}
    </div>
  );
}

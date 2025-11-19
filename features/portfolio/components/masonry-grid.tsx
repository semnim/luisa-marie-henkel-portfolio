'use client';

import { createSlugFromProjectTitle } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

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
};

export function MasonryGrid({ images }: MasonryGridProps) {
  if (images.length === 0) {
    return (
      <div className="hidden md:flex items-center justify-center min-h-[400px] bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="hidden md:block columns-2 lg:columns-3 gap-0 relative pt-0">
      <div className="absolute bottom-0 inset-x-0 h-[200px] z-20 mask-t-from-1% bg-radial from-100% from-background to-99% to-transparent" />
      {images.map((img, index) => (
        <Link
          href={
            img.title
              ? `/portfolio/${createSlugFromProjectTitle(img.title)}`
              : ''
          }
          key={img.id}
          className={` group overflow-hidden snap-center relative h-dvh lg:h-[500px]`}
        >
          <figure
            key={img.id}
            className="break-inside-avoid p-1 group cursor-pointer"
          >
            <div className="relative overflow-hidden">
              <Image
                unoptimized
                src={img.imageUrl}
                alt={`Grid - Image ${index + 1}`}
                width={img.width || 800}
                height={img.height || 1200}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {img.title && (
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
        </Link>
      ))}
    </div>
  );
}

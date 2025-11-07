'use client';

import { Heading } from '@/components/heading';
import { Image } from '@/components/image';
import { createSlugFromProjectTitle } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

const FEATURED_IMAGES = [
  {
    publicId: '5_taqgpt',
    title: 'fading ties',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_lzubo7',
    title: 'party',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_q3r8bc',
    title: 'mythical creature',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_candidate_1_msexrm',
    title: 'tangled manners',
    type: 'EDITORIAL',
  },
];

export const FeaturedShowcase = () => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
      setCurrentImgIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentImgIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(FEATURED_IMAGES.length - 1, currentImgIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleImageTouch = (index: number) => {
    setActiveIndex(index);
    setTimeout(() => setActiveIndex(null), 1000);
  };

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory overscroll-x-contain md:overflow-x-visible md:snap-none flex-1 relative"
      >
        {FEATURED_IMAGES.map((item, index) => (
          <Link
            className={`group relative overflow-hidden flex shrink-0 w-full md:w-auto md:flex-1 h-[calc(100dvh-60px)] snap-start`}
            key={index}
            href={`/work/${createSlugFromProjectTitle(item.title)}`}
            onNavigate={() => {
              handleImageTouch(index);
            }}
          >
            <figure className="flex flex-1">
              <Image
                src={item.publicId}
                alt={item.title}
                fill
                className={`object-cover lg:object-[50%_20%] xl:object-center group-hover:scale-110 transition-all group-hover:brightness-75 ${
                  activeIndex === index ? 'blur-sm' : ''
                }`}
              />
              <figcaption className="absolute inset-0 lg:hidden bottom-0 flex lg:group-hover:flex flex-col justify-start items-center h-50 bg-linear-to-b from-black/75 to-transparent mb-auto">
                <Heading
                  variant="ITEM"
                  title={item.title}
                  subtitle={item.type}
                  containerClassName="pt-4 lg:pt-8 "
                />
              </figcaption>
            </figure>
          </Link>
        ))}
      </div>

      {/* Navigation Chevrons */}
      {currentImgIndex > 0 && (
        <button
          onClick={handlePrev}
          className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentImgIndex < FEATURED_IMAGES.length - 1 && (
        <button
          onClick={handleNext}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

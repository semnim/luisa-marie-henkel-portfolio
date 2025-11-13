'use client';

import { Image } from '@/components/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface FeaturedProject {
  projectSlug: string;
  projectTitle: string;
  position: number;
  images: {
    desktop?: { imageUrl: string };
    mobile?: { imageUrl: string };
    both?: { imageUrl: string };
  };
}

interface FeaturedShowcaseProps {
  projects: FeaturedProject[];
}

export const FeaturedShowcase = ({ projects }: FeaturedShowcaseProps) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter projects with images
  const validProjects = projects.filter(
    (p) => p.images.both || (p.images.desktop && p.images.mobile)
  );

  const displayProjects = validProjects;

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
    const newIndex = Math.min(displayProjects.length - 1, currentImgIndex + 1);
    scrollToIndex(newIndex);
  };

  return (
    <div className="relative flex-1">
      <div
        ref={containerRef}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory overscroll-x-contain md:overflow-x-visible md:snap-none flex-1 relative"
      >
        {displayProjects.map((project, index) => {
          // Determine image URL based on breakpoint
          const imageUrl =
            project.images.both?.imageUrl ||
            (isMobile
              ? project.images.mobile?.imageUrl
              : project.images.desktop?.imageUrl) ||
            null;

          return (
            <Link
              className="group relative overflow-hidden flex shrink-0 w-full md:w-auto md:flex-1 h-dvh snap-start"
              key={index}
              href={`/portfolio/${project.projectSlug}`}
            >
              <figure className="flex flex-1 relative">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={project.projectTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover lg:object-[50%_20%] xl:object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  />
                ) : null}
                <figcaption className="absolute inset-0 lg:hidden bottom-0 flex lg:group-hover:flex flex-col justify-start items-center h-full bg-linear-to-b from-black/50 to-transparent mb-auto">
                  <div className="h-full flex items-center justify-center flex-col text-center z-20">
                    <p className="text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading">
                      {project.projectTitle}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Link>
          );
        })}
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

      {currentImgIndex < displayProjects.length - 1 && (
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

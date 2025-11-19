'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, useEffect, useRef, useState } from 'react';

interface FeaturedSlideshowProps {
  children: React.ReactNode;
}

export function FeaturedSlideshow({ children }: FeaturedSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const childrenArray = Children.toArray(children);
  const totalSlides = childrenArray.length;

  // Detect mobile breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(totalSlides - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory overscroll-x-contain md:overflow-x-visible md:snap-none md:gap-4"
      >
        {childrenArray.map((child, index) => (
          <div key={index} className="shrink-0 w-full md:w-auto md:flex-1 snap-start">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Chevrons (Mobile only) */}
      {isMobile && currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {isMobile && currentIndex < totalSlides - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
}

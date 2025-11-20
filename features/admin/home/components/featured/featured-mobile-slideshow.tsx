'use client';

import type {
  MediaUploadActions,
  MediaUploadState,
} from '@/features/admin/hooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { FeaturedProject, PreviewMode } from '../../types';
import { FeaturedSlotWrapper } from './featured-slot-wrapper';

interface FeaturedMobileSlideshowProps {
  projects: readonly [
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined
  ];
  states: readonly [
    MediaUploadState,
    MediaUploadState,
    MediaUploadState,
    MediaUploadState
  ];
  actions: readonly [
    MediaUploadActions,
    MediaUploadActions,
    MediaUploadActions,
    MediaUploadActions
  ];
  previewMode: PreviewMode;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
}

export function FeaturedMobileSlideshow({
  projects,
  states,
  actions,
  previewMode,
  onSelect,
  onRemove,
}: FeaturedMobileSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? 3 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === 3 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Slideshow container - fills remaining space */}
      <div className="overflow-x-hidden flex-1 min-h-0">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="w-full h-full shrink-0 px-1">
              <FeaturedSlotWrapper
                index={index}
                project={projects[index]}
                state={states[index]}
                actions={actions[index]}
                previewMode={previewMode}
                onSelect={() => onSelect(index)}
                onRemove={() => onRemove(index)}
                isMobileSlideshow={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot indicators */}
      <div className="py-4 flex shrink-0 justify-center gap-2">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-6 bg-foreground'
                : 'bg-gray-400 hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

'use client';

import { Project } from '@/lib/schema';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AutoRotatingCarouselProps {
  projects: Pick<Project, 'slug' | 'title'>[];
}

const AUTO_ROTATION_INTERVAL_MS = 5000;
const INTERACTION_DEBOUNCE_MS = 500;

export function AutoRotatingCarousel({ projects }: AutoRotatingCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const autoRotationRef = useRef<NodeJS.Timeout | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Advance to next image and restart auto-rotation
  const advanceToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
    interactionTimeoutRef.current = null;
    // Restart auto-rotation to prevent collision
    if (autoRotationRef.current) {
      clearInterval(autoRotationRef.current);
    }
    autoRotationRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, AUTO_ROTATION_INTERVAL_MS);
  }, [projects.length]);

  // Auto-rotation setup
  useEffect(() => {
    autoRotationRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, AUTO_ROTATION_INTERVAL_MS);

    return () => {
      if (autoRotationRef.current) {
        clearInterval(autoRotationRef.current);
      }
    };
  }, [projects.length]);

  // Mouse/touch interaction handlers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleInteraction = () => {
      // Clear existing debounce timer
      if (interactionTimeoutRef.current) {
        return;
      }

      interactionTimeoutRef.current = setTimeout(() => {
        advanceToNext();
      }, INTERACTION_DEBOUNCE_MS);
    };

    container.addEventListener('mousemove', handleInteraction, {
      passive: true,
    });
    container.addEventListener('touchmove', handleInteraction, {
      passive: true,
    });

    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      container.removeEventListener('mousemove', handleInteraction);
      container.removeEventListener('touchmove', handleInteraction);
    };
  }, [advanceToNext]);

  // Handle empty state
  if (projects.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-muted-foreground">No projects available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100dvh-60px)] mt-15 overflow-hidden relative select-none"
    >
      {/* All images stacked, only current visible */}
      {projects.map((project, index) => (
        <div
          key={project.slug}
          className={`absolute z-10 inset-0 flex items-center justify-center transition-all duration-150 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative max-w-[80vw] max-h-[80vh] w-full h-full flex items-center justify-center overflow-hidden">
            {/* Image */}
            <div className="relative flex items-center justify-center h-full w-full">
              <Image
                src={'/assets/home_hero.webp'}
                alt={project.title}
                fill
                className="object-contain object-center"
                unoptimized
              />
            </div>

            <div className="absolute inset-0 pointer-events-none z-30">
              <h2 className="absolute inset-0 flex items-center justify-center text-[2rem] md:text-[4rem] lg:text-[6rem] xl:text-[7rem] text-nowrap leading-none text-center">
                luisa-marie henkel
              </h2>
            </div>

            <div
              className="absolute inset-0 hover:opacity-90 transition-opacity pointer-events-auto"
              aria-label={project.title}
              tabIndex={index === currentIndex ? 0 : -1}
            />
          </div>
        </div>
      ))}

      {/* Project title below image */}
      {/* <div className="absolute bottom-16 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="text-xl md:text-lg font-light">
          {projects[currentIndex]?.title}
        </div>
      </div> */}

      {/* Screen reader only live region for current slide announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing project {currentIndex + 1} of {projects.length}:{' '}
        {projects[currentIndex]?.title}
      </div>
    </div>
  );
}

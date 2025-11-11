'use client';

import { Image } from '@/components/image';
import { Project } from '@/lib/schema';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { FilterPopover } from './filter-popover';
import { IndexPopover } from './index-popover';

interface HorizontalCarouselProps {
  projects: Project[];
  categories: string[];
  years: number[];
}

export function HorizontalCarousel({
  projects,
  categories,
  years,
}: HorizontalCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(categories)
  );
  const [activeYears, setActiveYears] = useState<Set<number>>(new Set(years));

  const [indexOpen, setIndexOpen] = useState(false);
  // Filter projects
  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          activeCategories.has(p.category) &&
          activeYears.has(new Date(p.publishedAt).getFullYear())
      ),
    [projects, activeCategories, activeYears]
  );

  // Toggle filter functions
  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const toggleYear = (year: number) => {
    setActiveYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  // Empty state
  if (filteredProjects.length === 0) {
    return (
      <>
        <div className="h-[calc(100vh-60px)] flex items-center justify-center">
          <p className="text-muted-foreground">No projects match filters</p>
        </div>
        <div className="w-full px-8 pb-4 flex justify-between">
          <IndexPopover projects={projects} />
          <FilterPopover
            categories={categories}
            years={years}
            numResults={filteredProjects.length}
            activeCategories={activeCategories}
            activeYears={activeYears}
            onToggleCategory={toggleCategory}
            onToggleYear={toggleYear}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Carousel
        opts={{ loop: true, dragFree: false, skipSnaps: true }}
        className="relative h-10/12 w-full my-auto overflow-hidden select-none flex"
        setApi={(api) => {
          api?.on('select', () => {
            setCurrentIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent className="w-dvw h-full">
          {filteredProjects.map((project, index) => (
            <CarouselItem
              key={index}
              className={`pl-1 basis-2/3 lg:basis-1/3 touch-pan-y ${
                index === currentIndex ? 'z-50' : 'z-10'
              }`}
            >
              <div
                className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
                  index === currentIndex ? 'scale-120' : 'scale-100 opacity-60'
                }`}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="cursor-grab relative h-[70vh] w-full"
                >
                  <Image
                    src={project.thumbnailPublicId}
                    alt={project.title}
                    fill
                    className="object-contain object-center"
                  />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
      <CarouselNext /> */}
      </Carousel>
      <div className="mb-10 text-center">
        <h2 className="text-2xl">{filteredProjects[currentIndex].title}</h2>
        <div className="text-xs text-muted-foreground text-light">
          <span>{filteredProjects[currentIndex].category}</span>
          &nbsp; – &nbsp;
          <time
            dateTime={filteredProjects[currentIndex].publishedAt.toISOString()}
          >
            {formatDate(filteredProjects[currentIndex].publishedAt)}
          </time>
        </div>
      </div>
      <div className="w-full px-8 pb-4 flex justify-between">
        {/* <IndexPopover projects={projects} /> */}
        <div
          className="cursor-pointer hover:text-muted-foreground text-foreground"
          onClick={() => setIndexOpen((prev) => !prev)}
        >
          {indexOpen ? 'Gallery' : 'Index'}
        </div>
        <div
          className={`absolute top-0 right-0 bottom-0 bg-background w-dvw transition-[left] ease-in-out duration-750 flex flex-col items-center justify-center overflow-y-auto px-4 h-[calc(100dvh-60px)] ${
            indexOpen ? 'left-0' : '-left-[100dvw]'
          }`}
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="text-4xl md:text-6xl font-light py-2 hover:text-muted-foreground transition-colors"
            >
              {project.title}
            </Link>
          ))}
        </div>
        <FilterPopover
          categories={categories}
          years={years}
          activeCategories={activeCategories}
          activeYears={activeYears}
          numResults={filteredProjects.length}
          onToggleCategory={toggleCategory}
          onToggleYear={toggleYear}
        />
      </div>
    </>
  );
}

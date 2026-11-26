import type { FeaturedProject } from '@/features/home/actions/fetch-featured';
import {
  MobileSlideshow,
  type SlideshowImage,
} from '@/features/portfolio/components/mobile-slideshow';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DesktopSplitPresentation } from './desktop-split-presentation';

type Props = {
  projects: FeaturedProject[];
};

/**
 * Both layouts are rendered and CSS picks one, so the section is there before
 * hydration. Images are lazy, so the hidden layout downloads nothing.
 */
export const FeaturedShowcase = ({ projects }: Props) => {
  const slides = projects.flatMap((project): SlideshowImage[] => {
    const image =
      project.images.mobile ?? project.images.both ?? project.images.desktop;
    return image
      ? [
          {
            ...image,
            href: `/portfolio/${project.projectSlug}`,
            title: project.projectTitle,
          },
        ]
      : [];
  });

  return (
    <>
      <MobileSlideshow
        images={slides}
        label="Featured projects"
        header={
          <div className="flex items-center justify-between text-[11px] tracking-item-subheading uppercase">
            <h2 className="text-foreground/70">Featured</h2>
            <Link
              href="/portfolio"
              className="pointer-events-auto -my-3 flex items-center gap-2 py-3"
            >
              All projects
              <ArrowRight aria-hidden className="size-3.5" strokeWidth={1.25} />
            </Link>
          </div>
        }
      />
      <DesktopSplitPresentation projects={projects} />
    </>
  );
};

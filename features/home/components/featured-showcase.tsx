'use client';

import { FeaturedProject } from '@/features/home/actions/fetch-featured';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { MobileSlideshow } from '@/features/portfolio/components/mobile-slideshow';
import { DesktopSplitPresentation } from './desktop-split-presentation';

type Props = {
  projects: FeaturedProject[];
};

export const FeaturedShowcase = ({ projects }: Props) => {
  const isMobile = useIsMobile();

  const imagesFlat = projects.flatMap((p) =>
    Object.values(p.images).map((img) => ({
      ...img,
      href: `/portfolio/${p.projectSlug}`,
      title: p.projectTitle,
    }))
  );

  if (isMobile) {
    return <MobileSlideshow images={imagesFlat} />;
  }

  return <DesktopSplitPresentation projects={projects} />;
};

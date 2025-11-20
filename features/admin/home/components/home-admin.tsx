'use client';

import { useState } from 'react';
import { useHero, useFeaturedProjects } from '@/features/home/api';
import { useProjects } from '@/features/portfolio/api';
import { HeroSection } from './hero';
import { FeaturedSection } from './featured';
import { PreviewModeToolbar } from './shared/preview-mode-toolbar';
import type { PreviewMode, AvailableProject } from '../types';

export function HomeAdmin() {
  // Data fetching via TanStack Query
  const { data: heroResult } = useHero();
  const { data: featuredResult } = useFeaturedProjects();
  const { data: availableProjectsData } = useProjects();

  // Shared preview mode state
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');

  // Transform available projects data
  const availableProjects: AvailableProject[] = availableProjectsData
    ? availableProjectsData.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
      }))
    : [];

  return (
    <div className="px-6 py-4 space-y-8 max-w-7xl mx-auto">
      <header className="flex justify-between">
        <h2 className="text-2xl font-light tracking-item-subheading uppercase">
          HOME
        </h2>
        <PreviewModeToolbar mode={previewMode} onChange={setPreviewMode} />
      </header>

      <div className="space-y-16">
        <HeroSection heroResult={heroResult} previewMode={previewMode} />
        <FeaturedSection
          featuredResult={featuredResult}
          availableProjects={availableProjects}
          previewMode={previewMode}
        />
      </div>
    </div>
  );
}

'use client';

import type { Image } from '@/lib/schema';
import { useFeaturedHandlers, useFeaturedState } from '../../hooks';
import type { AvailableProject, PreviewMode } from '../../types';
import { FeaturedGrid } from './featured-grid';
import { FeaturedToolbar } from './featured-toolbar';
import { ProjectSelector } from './project-selector';

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

interface FeaturedImages {
  desktop?: Image | null;
  mobile?: Image | null;
  both?: Image | null;
}

interface FeaturedProjectData {
  position: number;
  projectSlug: string;
  projectTitle: string;
  images: FeaturedImages;
}

interface FeaturedSectionProps {
  featuredResult: ActionResult<FeaturedProjectData[]> | undefined | null;
  availableProjects: AvailableProject[];
  previewMode: PreviewMode;
}

export function FeaturedSection({
  featuredResult,
  availableProjects,
  previewMode,
}: FeaturedSectionProps) {
  const featuredState = useFeaturedState(featuredResult);
  const handlers = useFeaturedHandlers({
    ...featuredState,
    availableProjects,
  });

  return (
    <section className="h-[calc(100dvh-32px)] flex flex-col md:block md:h-auto md:space-y-6">
      <h2 className="text-xl font-light tracking-item-subheading uppercase shrink-0 mb-3 md:mb-6">
        FEATURED PROJECTS
      </h2>

      <div className="flex-1 min-h-0 md:contents">
        <FeaturedGrid
          projects={featuredState.projects}
          states={featuredState.states}
          actions={featuredState.actions}
          previewMode={previewMode}
          onSelect={handlers.handleSelect}
          onRemove={handlers.handleRemove}
        />
      </div>

      {handlers.hasChanges && (
        <FeaturedToolbar
          isSaving={handlers.isSaving}
          onSave={handlers.handleSave}
          onReset={handlers.handleReset}
        />
      )}

      <ProjectSelector
        isOpen={handlers.selectorOpen}
        projects={handlers.unselectedProjects}
        onClose={() => handlers.setSelectorOpen(false)}
        onSelect={handlers.handleProjectSelect}
      />
    </section>
  );
}

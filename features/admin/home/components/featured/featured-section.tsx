'use client';

import type { PreviewMode, AvailableProject } from '../../types';
import type { Image } from '@/lib/schema';
import { useFeaturedState, useFeaturedHandlers } from '../../hooks';
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
    <section className="space-y-6">
      <h2 className="text-xl font-light tracking-item-subheading uppercase">
        FEATURED PROJECTS
      </h2>

      <FeaturedGrid
        projects={featuredState.projects}
        states={featuredState.states}
        actions={featuredState.actions}
        previewMode={previewMode}
        onSelect={handlers.handleSelect}
        onRemove={handlers.handleRemove}
      />

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

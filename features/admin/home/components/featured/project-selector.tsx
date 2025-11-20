'use client';

import type { AvailableProject } from '../../types';
import { ProjectSelectorDialog } from '@/features/admin/portfolio/components/project-selector-dialog';

interface ProjectSelectorProps {
  isOpen: boolean;
  projects: AvailableProject[];
  onClose: () => void;
  onSelect: (project: { id: string; title: string }) => void;
}

export function ProjectSelector({
  isOpen,
  projects,
  onClose,
  onSelect,
}: ProjectSelectorProps) {
  // Map AvailableProject (id: number) to Project (id: string)
  const mappedProjects = projects.map((p) => ({
    id: p.slug,
    title: p.title,
    slug: p.slug,
  }));

  return (
    <ProjectSelectorDialog
      isOpen={isOpen}
      projects={mappedProjects}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}

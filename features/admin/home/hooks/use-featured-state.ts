import { useState, useCallback, useEffect } from 'react';
import { useMediaUploadState } from '@/features/admin/hooks/use-media-upload-state';
import type { FeaturedStateReturn, FeaturedProject } from '../types';
import type { Image } from '@/lib/schema';
import { FEATURED_SLOTS_COUNT } from '../constants';

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

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

type FeaturedSlots = readonly [
  FeaturedProject | undefined,
  FeaturedProject | undefined,
  FeaturedProject | undefined,
  FeaturedProject | undefined
];

const EMPTY_SLOTS: FeaturedSlots = [undefined, undefined, undefined, undefined];

export function useFeaturedState(
  featuredResult: ActionResult<FeaturedProjectData[]> | undefined | null
): FeaturedStateReturn {
  // Initialize 4 MediaUploadState hooks (one per featured slot)
  const [slot0State, slot0Actions] = useMediaUploadState();
  const [slot1State, slot1Actions] = useMediaUploadState();
  const [slot2State, slot2Actions] = useMediaUploadState();
  const [slot3State, slot3Actions] = useMediaUploadState();

  // Manage projects array as FeaturedSlots tuple
  const [projects, setProjects] = useState<FeaturedSlots>(EMPTY_SLOTS);
  const [initialProjects, setInitialProjects] =
    useState<FeaturedSlots>(EMPTY_SLOTS);

  // Bundle states and actions
  const states = [slot0State, slot1State, slot2State, slot3State] as const;
  const actions = [slot0Actions, slot1Actions, slot2Actions, slot3Actions] as const;

  // Load projects from DB and sync to upload states
  const loadProjects = useCallback(async () => {
    if (!featuredResult?.success || !featuredResult.data) return;

    // Create mutable copy for updates
    const updatedProjects = [...EMPTY_SLOTS] as Array<FeaturedProject | undefined>;

    // Bundle actions locally to avoid recreating
    const actionsArray = [slot0Actions, slot1Actions, slot2Actions, slot3Actions];

    for (const projectData of featuredResult.data) {
      const position = projectData.position;

      // Validate position bounds
      if (position < 0 || position >= FEATURED_SLOTS_COUNT) continue;

      // Set project info
      updatedProjects[position] = {
        id: projectData.projectSlug,
        slug: projectData.projectSlug,
        title: projectData.projectTitle,
      };

      // Set existing images on upload state (validate images object exists)
      if (projectData.images) {
        actionsArray[position].setExistingImages({
          desktop: projectData.images.desktop ?? null,
          mobile: projectData.images.mobile ?? null,
          both: projectData.images.both ?? null,
        });
      }
    }

    // Cast to FeaturedSlots tuple type (safe because updatedProjects starts as EMPTY_SLOTS with 4 elements)
    const projectsTyped = updatedProjects as unknown as FeaturedSlots;
    setProjects(projectsTyped);
    setInitialProjects(projectsTyped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredResult]);

  // Auto-load on mount and when featuredResult changes
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredResult]);

  return {
    projects,
    setProjects,
    initialProjects,
    states,
    actions,
    loadProjects,
  };
}

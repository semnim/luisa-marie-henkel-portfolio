import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks/use-media-upload-state';
import type { FeaturedProject, AvailableProject, FeaturedHandlersReturn } from '@/features/admin/home/types';
import { hasFeaturedChanges } from '@/features/admin/home/lib/has-featured-changes';
import { getProjectsToDelete } from '@/features/admin/home/utils/featured-changes';
import { getUnselectedProjects } from '@/features/admin/home/utils/filter-projects';
import { saveAllFeatured, deleteFeaturedImages } from '@/features/home/actions/featured';
import { FEATURED_TOAST_MESSAGES } from '@/features/admin/home/constants';

interface UseFeaturedHandlersProps {
  projects: readonly [FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined];
  setProjects: (projects: readonly [FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined]) => void;
  initialProjects: readonly [FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined];
  states: readonly [MediaUploadState, MediaUploadState, MediaUploadState, MediaUploadState];
  actions: readonly [MediaUploadActions, MediaUploadActions, MediaUploadActions, MediaUploadActions];
  loadProjects: () => Promise<void>;
  availableProjects: AvailableProject[];
}

export function useFeaturedHandlers({
  projects,
  setProjects,
  initialProjects,
  states,
  actions,
  loadProjects,
  availableProjects,
}: UseFeaturedHandlersProps): FeaturedHandlersReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedSlot(index);
    setSelectorOpen(true);
  };

  const handleProjectSelect = (project: { id: string; title: string }) => {
    if (selectedSlot !== null) {
      const updated = [...projects] as [
        FeaturedProject | undefined,
        FeaturedProject | undefined,
        FeaturedProject | undefined,
        FeaturedProject | undefined
      ];
      updated[selectedSlot] = { ...project, slug: project.id };
      setProjects(updated);
    }
    setSelectorOpen(false);
    setSelectedSlot(null);
  };

  const handleRemove = (index: number) => {
    // Only clear from state - actual deletion happens on save
    const updated = [...projects] as [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ];
    updated[index] = undefined;
    setProjects(updated);

    // Reset upload state for this slot
    actions[index].setExistingImages({
      desktop: null,
      mobile: null,
      both: null,
    });
    actions[index].reset();
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Handle removed projects first
      const projectsToDeleteList = getProjectsToDelete(initialProjects, projects);
      for (const slug of projectsToDeleteList) {
        const result = await deleteFeaturedImages(slug);
        if (!result.success) {
          throw new Error(`${FEATURED_TOAST_MESSAGES.DELETE_FAILED} ${slug}: ${result.error}`);
        }
      }

      // Build data array for projects with changes
      const dataToSave: Array<{
        projectSlug: string;
        position: number;
        desktop?: File;
        mobile?: File;
        both?: File;
      }> = [];

      // Process each slot
      for (let i = 0; i < 4; i++) {
        const project = projects[i];
        if (!project) continue;

        const state = states[i];
        const {
          desktop,
          mobile,
          existingBoth,
          deleteDesktop,
          deleteMobile,
          deleteBoth,
        } = state;

        // Check if this slot has any changes
        const hasChanges =
          desktop !== null ||
          mobile !== null ||
          deleteDesktop ||
          deleteMobile ||
          deleteBoth;

        if (!hasChanges) continue;

        // Handle deletions (delete all images for project)
        if (deleteBoth && existingBoth) {
          await deleteFeaturedImages(project.slug);
          actions[i].setExistingImages({
            desktop: null,
            mobile: null,
            both: null,
          });
          continue;
        }

        // Handle new uploads (auto-detect mode like hero)
        const hasDesktop = desktop !== null;
        const hasMobile = mobile !== null;

        if (hasDesktop || hasMobile) {
          const item: {
            projectSlug: string;
            position: number;
            desktop?: File;
            mobile?: File;
            both?: File;
          } = {
            projectSlug: project.slug,
            position: i,
          };

          // Auto-detect: if only one file, use "both"; if both files, use separate
          if (hasDesktop && !hasMobile) {
            item.both = desktop.file;
          } else if (!hasDesktop && hasMobile) {
            item.both = mobile.file;
          } else if (hasDesktop && hasMobile) {
            item.desktop = desktop.file;
            item.mobile = mobile.file;
          }

          dataToSave.push(item);
        }
      }

      // Call saveAllFeatured if there are changes
      if (dataToSave.length > 0) {
        const result = await saveAllFeatured(dataToSave);
        if (!result.success) {
          throw new Error(result.error || FEATURED_TOAST_MESSAGES.SAVE_FAILED);
        }
      }

      // Reset all states and reload
      actions.forEach((action) => action.reset());
      await loadProjects();

      toast.success(FEATURED_TOAST_MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : FEATURED_TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    actions.forEach(action => action.reset());
    setProjects(initialProjects);
    // Restore existingImages for initial projects
    loadProjects();
  };

  const hasChanges = useMemo(
    () => hasFeaturedChanges(initialProjects, projects, [...states]),
    [initialProjects, projects, states]
  );

  const unselectedProjects = useMemo(
    () => getUnselectedProjects(availableProjects, projects),
    [availableProjects, projects]
  );

  return {
    handleSelect,
    handleProjectSelect,
    handleRemove,
    handleSave,
    handleReset,
    hasChanges,
    isSaving,
    selectorOpen,
    setSelectorOpen,
    selectedSlot,
    unselectedProjects,
  };
}

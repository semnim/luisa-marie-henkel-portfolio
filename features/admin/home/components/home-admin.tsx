'use client';

import { FeaturedSlideshow } from '@/features/admin/home/components/featured-slideshow';
import { FeaturedSlot } from '@/features/admin/home/components/featured-slot';
import { hasFeaturedChanges } from '@/features/admin/home/lib/has-featured-changes';
import { getProjectsToDelete } from '@/features/admin/home/utils/featured-changes';
import { getUnselectedProjects } from '@/features/admin/home/utils/filter-projects';
import { useMediaPreview, useMediaUploadState } from '@/features/admin/hooks';
import { MediaToolbar } from '@/features/admin/portfolio/components/media-toolbar';
import { MediaUploadBox } from '@/features/admin/portfolio/components/media-upload-box';
import { ProjectSelectorDialog } from '@/features/admin/portfolio/components/project-selector-dialog';
import {
  deleteFeaturedImages,
  saveAllFeatured,
} from '@/features/home/actions/featured';
import {
  convertHero,
  deleteHero,
  uploadHero,
} from '@/features/home/actions/hero';
import { useFeaturedProjects, useHero } from '@/features/home/api';
import { useProjects } from '@/features/portfolio/api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
}

interface AvailableProject {
  id: number;
  title: string;
  slug: string;
}

export function HomeAdmin() {
  // Fetch data via TanStack Query (replaces useEffect fetching)
  const { data: heroResult } = useHero();
  const { data: featuredResult } = useFeaturedProjects();
  const { data: availableProjectsData } = useProjects();

  // Shared preview mode across all sections
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  // Hero upload state using custom hook
  const [heroState, heroActions] = useMediaUploadState();
  const heroPreview = useMediaPreview(
    heroState,
    '/assets/home_hero.webp',
    previewMode
  );

  // Featured upload states for each slot (4 slots)
  const [featured0State, featured0Actions] = useMediaUploadState();
  const [featured1State, featured1Actions] = useMediaUploadState();
  const [featured2State, featured2Actions] = useMediaUploadState();
  const [featured3State, featured3Actions] = useMediaUploadState();
  const featured0Preview = useMediaPreview(
    featured0State,
    undefined,
    previewMode
  );
  const featured1Preview = useMediaPreview(
    featured1State,
    undefined,
    previewMode
  );
  const featured2Preview = useMediaPreview(
    featured2State,
    undefined,
    previewMode
  );
  const featured3Preview = useMediaPreview(
    featured3State,
    undefined,
    previewMode
  );

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableProjects, setAvailableProjects] = useState<
    AvailableProject[]
  >([]);

  const [featuredProjects, setFeaturedProjects] = useState<
    [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ]
  >([undefined, undefined, undefined, undefined]);
  const [initialFeaturedProjects, setInitialFeaturedProjects] = useState<
    [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ]
  >([undefined, undefined, undefined, undefined]);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  // Load featured images from DB
  const loadFeaturedImages = useCallback(async () => {
    if (!featuredResult?.success || !featuredResult.data) return;

    // Map projects by position and set existing images on upload states
    const featuredActions = [
      featured0Actions,
      featured1Actions,
      featured2Actions,
      featured3Actions,
    ];
    const projects = [...featuredProjects];

    for (const projectData of featuredResult.data) {
      const position = projectData.position;
      if (position >= 0 && position < 4) {
        // Set project info
        projects[position] = {
          id: projectData.projectSlug,
          slug: projectData.projectSlug,
          title: projectData.projectTitle,
        };

        // Set existing images on upload state
        featuredActions[position].setExistingImages({
          desktop: projectData.images.desktop || null,
          mobile: projectData.images.mobile || null,
          both: projectData.images.both || null,
        });
      }
    }

    const projectsTyped = projects as [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ];
    setFeaturedProjects(projectsTyped);
    setInitialFeaturedProjects(projectsTyped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredResult]);

  // Sync hero data to upload state (state sync useEffect, NOT fetching)
  useEffect(() => {
    if (heroResult?.success && heroResult.data) {
      heroActions.setExistingImages({
        desktop: heroResult.data.desktop || null,
        mobile: heroResult.data.mobile || null,
        both: heroResult.data.both || null,
      });
    }
    setIsLoading(false);
  }, [heroResult, heroActions]);

  // Load featured images on mount
  useEffect(() => {
    loadFeaturedImages();
  }, [loadFeaturedImages]);

  // Sync available projects from query data
  useEffect(() => {
    if (availableProjectsData) {
      setAvailableProjects(
        availableProjectsData.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        }))
      );
    }
  }, [availableProjectsData]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const {
        desktop,
        mobile,
        existingDesktop,
        existingMobile,
        existingBoth,
        deleteDesktop,
        deleteMobile,
        deleteBoth,
        convertBothTo,
      } = heroState;

      // Execute pending conversion first (convert "both" to single variant)
      let updatedExistingDesktop = existingDesktop;
      let updatedExistingMobile = existingMobile;
      let updatedExistingBoth = existingBoth;

      if (convertBothTo && existingBoth) {
        const result = await convertHero(convertBothTo);
        if (!result.success) {
          throw new Error(result.error || 'Conversion failed');
        }
        // Update local state based on which variant we converted to
        if (convertBothTo === 'desktop') {
          updatedExistingDesktop = result.data!;
        } else {
          updatedExistingMobile = result.data!;
        }
        updatedExistingBoth = null;
      }

      // Execute pending deletions
      if (deleteDesktop && updatedExistingDesktop) {
        await deleteHero('desktop');
        updatedExistingDesktop = null;
      }
      if (deleteMobile && updatedExistingMobile) {
        await deleteHero('mobile');
        updatedExistingMobile = null;
      }
      if (deleteBoth && updatedExistingBoth) {
        await deleteHero('both');
        updatedExistingBoth = null;
      }

      // Auto-detect mode considering existing images after conversion
      const hasDesktopUpload = desktop !== null;
      const hasMobileUpload = mobile !== null;
      const hasExistingDesktopAfter = updatedExistingDesktop !== null;
      const hasExistingMobileAfter = updatedExistingMobile !== null;

      // Use "both" mode only if uploading single file AND no existing separate variant
      const useBothMode =
        (hasDesktopUpload && !hasMobileUpload && !hasExistingMobileAfter) ||
        (hasMobileUpload && !hasDesktopUpload && !hasExistingDesktopAfter);

      const newImages = {
        desktop: updatedExistingDesktop,
        mobile: updatedExistingMobile,
        both: updatedExistingBoth,
      };

      if (useBothMode) {
        // Upload "both" variant (use whichever is selected)
        const file = desktop || mobile;
        if (file) {
          const formData = new FormData();
          formData.append('file', file.file);
          formData.append('variant', 'both');
          const result = await uploadHero(formData);
          if (!result.success) {
            throw new Error(result.error || 'Upload failed');
          }
          newImages.both = result.data!;
        }

        // Delete desktop and mobile if they exist
        if (updatedExistingDesktop) {
          await deleteHero('desktop');
          newImages.desktop = null;
        }
        if (updatedExistingMobile) {
          await deleteHero('mobile');
          newImages.mobile = null;
        }
      } else if (hasDesktopUpload || hasMobileUpload) {
        // Upload separate variants
        if (hasDesktopUpload) {
          const formDataDesktop = new FormData();
          formDataDesktop.append('file', desktop!.file);
          formDataDesktop.append('variant', 'desktop');
          const resultDesktop = await uploadHero(formDataDesktop);
          if (!resultDesktop.success) {
            throw new Error(resultDesktop.error || 'Desktop upload failed');
          }
          newImages.desktop = resultDesktop.data!;
        }

        if (hasMobileUpload) {
          const formDataMobile = new FormData();
          formDataMobile.append('file', mobile!.file);
          formDataMobile.append('variant', 'mobile');
          const resultMobile = await uploadHero(formDataMobile);
          if (!resultMobile.success) {
            throw new Error(resultMobile.error || 'Mobile upload failed');
          }
          newImages.mobile = resultMobile.data!;
        }

        // Delete "both" if it exists
        if (updatedExistingBoth) {
          await deleteHero('both');
          newImages.both = null;
        }
      }

      // Update state with new images and reset
      heroActions.setExistingImages(newImages);
      heroActions.reset();

      toast.success('Saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeaturedSelect = (index: number) => {
    setSelectedSlotIndex(index);
    setSelectorOpen(true);
  };

  const handleProjectSelect = (project: { id: string; title: string }) => {
    if (selectedSlotIndex !== null) {
      const updated = [...featuredProjects] as [
        FeaturedProject | undefined,
        FeaturedProject | undefined,
        FeaturedProject | undefined,
        FeaturedProject | undefined
      ];
      updated[selectedSlotIndex] = { ...project, slug: project.id };
      setFeaturedProjects(updated);
    }
    setSelectorOpen(false);
    setSelectedSlotIndex(null);
  };

  const handleFeaturedProjectRemove = (index: number) => {
    // Only clear from state - actual deletion happens on save
    const updated = [...featuredProjects] as [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ];
    updated[index] = undefined;
    setFeaturedProjects(updated);

    // Reset upload state for this slot
    const actions = [
      featured0Actions,
      featured1Actions,
      featured2Actions,
      featured3Actions,
    ];
    actions[index].setExistingImages({
      desktop: null,
      mobile: null,
      both: null,
    });
    actions[index].reset();
  };

  const handleSaveAllFeatured = async () => {
    setIsSaving(true);

    try {
      const states = [
        featured0State,
        featured1State,
        featured2State,
        featured3State,
      ];
      const actions = [
        featured0Actions,
        featured1Actions,
        featured2Actions,
        featured3Actions,
      ];

      // Handle removed projects first
      const projectsToDelete = getProjectsToDelete(
        initialFeaturedProjects,
        featuredProjects
      );
      for (const slug of projectsToDelete) {
        const result = await deleteFeaturedImages(slug);
        if (!result.success) {
          throw new Error(`Failed to delete ${slug}: ${result.error}`);
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
        const project = featuredProjects[i];
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
          throw new Error(result.error || 'Save failed');
        }
      }

      // Reset all states and reload
      actions.forEach((action) => action.reset());
      await loadFeaturedImages();

      toast.success('Featured projects saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetFeatured = () => {
    featured0Actions.reset();
    featured1Actions.reset();
    featured2Actions.reset();
    featured3Actions.reset();
    setFeaturedProjects(initialFeaturedProjects);
    // Restore existingImages for initial projects
    loadFeaturedImages();
  };

  const hasHeroChanges =
    heroState.desktop !== null ||
    heroState.mobile !== null ||
    heroState.deleteDesktop ||
    heroState.deleteMobile ||
    heroState.deleteBoth ||
    heroState.convertBothTo !== null;

  const hasFeaturedChangesValue = hasFeaturedChanges(
    initialFeaturedProjects,
    featuredProjects,
    [featured0State, featured1State, featured2State, featured3State]
  );

  if (isLoading) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-light tracking-item-subheading uppercase">
          HOME
        </h2>
        {/* Shared Preview Toolbar */}
        <MediaToolbar
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
      </div>
      <div className="mx-auto w-fit"></div>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-light tracking-item-subheading uppercase">
            HERO
          </h2>

          {/* Upload Box */}
          <div
            className={
              previewMode === 'desktop'
                ? 'w-full max-w-md'
                : 'w-full max-w-[280px] md:max-w-[320px]'
            }
          >
            <MediaUploadBox
              aspectRatio={previewMode === 'desktop' ? '16/9' : '9/16'}
              accept="image"
              currentMedia={heroPreview.currentMedia}
              onFileSelect={
                previewMode === 'desktop'
                  ? heroActions.setDesktop
                  : heroActions.setMobile
              }
              onRemove={
                previewMode === 'desktop'
                  ? heroActions.removeDesktop
                  : heroActions.removeMobile
              }
              isRemovable={heroPreview.isRemovable}
            />
          </div>

          {/* Hero Actions */}
          {hasHeroChanges && (
            <MediaToolbar
              hasChanges={hasHeroChanges}
              isSaving={isSaving}
              onSave={handleSave}
              onReset={heroActions.reset}
            />
          )}
        </section>

        {/* Featured Section */}
        <section className="space-y-6 mb-4">
          <h2 className="text-xl font-light tracking-item-subheading uppercase">
            FEATURED PROJECTS
          </h2>

          <FeaturedSlideshow>
            <FeaturedSlot
              project={featuredProjects[0]}
              previewMode={previewMode}
              currentMedia={featured0Preview.currentMedia}
              isRemovable={featured0Preview.isRemovable}
              actions={featured0Actions}
              onSelect={() => handleFeaturedSelect(0)}
              onProjectRemove={() => handleFeaturedProjectRemove(0)}
            />
            <FeaturedSlot
              project={featuredProjects[1]}
              previewMode={previewMode}
              currentMedia={featured1Preview.currentMedia}
              isRemovable={featured1Preview.isRemovable}
              actions={featured1Actions}
              onSelect={() => handleFeaturedSelect(1)}
              onProjectRemove={() => handleFeaturedProjectRemove(1)}
            />
            <FeaturedSlot
              project={featuredProjects[2]}
              previewMode={previewMode}
              currentMedia={featured2Preview.currentMedia}
              isRemovable={featured2Preview.isRemovable}
              actions={featured2Actions}
              onSelect={() => handleFeaturedSelect(2)}
              onProjectRemove={() => handleFeaturedProjectRemove(2)}
            />
            <FeaturedSlot
              project={featuredProjects[3]}
              previewMode={previewMode}
              currentMedia={featured3Preview.currentMedia}
              isRemovable={featured3Preview.isRemovable}
              actions={featured3Actions}
              onSelect={() => handleFeaturedSelect(3)}
              onProjectRemove={() => handleFeaturedProjectRemove(3)}
            />
          </FeaturedSlideshow>

          {/* Featured Actions */}
          {hasFeaturedChangesValue && (
            <MediaToolbar
              hasChanges={hasFeaturedChangesValue}
              isSaving={isSaving}
              onSave={handleSaveAllFeatured}
              onReset={handleResetFeatured}
            />
          )}
        </section>
      </div>

      {/* Project Selector Dialog */}
      <ProjectSelectorDialog
        isOpen={selectorOpen}
        projects={getUnselectedProjects(availableProjects, featuredProjects).map(
          (p) => ({
            id: p.slug,
            title: p.title,
            slug: p.slug,
          })
        )}
        onClose={() => {
          setSelectorOpen(false);
          setSelectedSlotIndex(null);
        }}
        onSelect={handleProjectSelect}
      />
    </div>
  );
}

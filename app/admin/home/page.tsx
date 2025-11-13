'use client';

import {
  deleteFeaturedImages,
  fetchFeaturedProjects,
  saveAllFeatured,
} from '@/app/actions/featured';
import {
  convertHero,
  deleteHero,
  fetchCurrentHero,
  uploadHero,
} from '@/app/actions/hero';
import { fetchAllProjects } from '@/app/actions/projects';
import { FeaturedSlideshow } from '@/components/admin/featured-slideshow';
import { FeaturedSlot } from '@/components/admin/featured-slot';
import { MediaToolbar } from '@/components/admin/media-toolbar';
import { MediaUploadBox } from '@/components/admin/media-upload-box';
import { ProjectSelectorDialog } from '@/components/admin/project-selector-dialog';
import { useMediaPreview } from '@/hooks/use-media-preview';
import { useMediaUploadState } from '@/hooks/use-media-upload-state';
import { useEffect, useState } from 'react';
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

export default function AdminHomePage() {
  // Hero upload state using custom hook
  const [heroState, heroActions] = useMediaUploadState();
  const heroPreview = useMediaPreview(heroState, '/assets/home_hero.webp');

  // Featured upload states for each slot (4 slots)
  const [featured0State, featured0Actions] = useMediaUploadState();
  const [featured1State, featured1Actions] = useMediaUploadState();
  const [featured2State, featured2Actions] = useMediaUploadState();
  const [featured3State, featured3Actions] = useMediaUploadState();
  const featured0Preview = useMediaPreview(featured0State, undefined);
  const featured1Preview = useMediaPreview(featured1State, undefined);
  const featured2Preview = useMediaPreview(featured2State, undefined);
  const featured3Preview = useMediaPreview(featured3State, undefined);

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

  // Section-level preview toggle
  const [sectionPreview, setSectionPreview] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  // Load featured images from DB
  const loadFeaturedImages = async () => {
    const result = await fetchFeaturedProjects();
    if (result.success && result.data) {
      // Map projects by position and set existing images on upload states
      const featuredActions = [
        featured0Actions,
        featured1Actions,
        featured2Actions,
        featured3Actions,
      ];
      const projects = [...featuredProjects];

      for (const projectData of result.data) {
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
    }
  };

  // Fetch existing hero images on mount
  useEffect(() => {
    async function loadHeroImages() {
      const result = await fetchCurrentHero();
      if (result.success && result.data) {
        heroActions.setExistingImages({
          desktop: result.data.desktop || null,
          mobile: result.data.mobile || null,
          both: result.data.both || null,
        });
      }
      setIsLoading(false);
    }
    loadHeroImages();
  }, [heroActions]);

  // Load featured images on mount
  useEffect(() => {
    loadFeaturedImages();
  }, []);

  // Load available projects on mount
  useEffect(() => {
    async function loadProjects() {
      const projects = await fetchAllProjects();
      setAvailableProjects(
        projects.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
        }))
      );
    }
    loadProjects();
  }, []);

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
      if (convertBothTo && existingBoth) {
        const result = await convertHero(convertBothTo);
        if (!result.success) {
          throw new Error(result.error || 'Conversion failed');
        }
        // Update state based on which variant we converted to
        heroActions.setExistingImages({
          desktop: convertBothTo === 'desktop' ? result.data! : existingDesktop,
          mobile: convertBothTo === 'mobile' ? result.data! : existingMobile,
          both: null,
        });
      }

      // Execute pending deletions
      if (deleteDesktop && existingDesktop) {
        await deleteHero('desktop');
      }
      if (deleteMobile && existingMobile) {
        await deleteHero('mobile');
      }
      if (deleteBoth && existingBoth) {
        await deleteHero('both');
      }

      // Auto-detect mode: if only one file, use "both"; if both, use separate
      const hasDesktop = desktop !== null;
      const hasMobile = mobile !== null;
      const useBothMode =
        (hasDesktop && !hasMobile) || (!hasDesktop && hasMobile);

      const newImages = {
        desktop: existingDesktop,
        mobile: existingMobile,
        both: existingBoth,
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
        if (existingDesktop) {
          await deleteHero('desktop');
          newImages.desktop = null;
        }
        if (existingMobile) {
          await deleteHero('mobile');
          newImages.mobile = null;
        }
      } else if (hasDesktop && hasMobile) {
        // Upload separate desktop and mobile variants
        const formDataDesktop = new FormData();
        formDataDesktop.append('file', desktop!.file);
        formDataDesktop.append('variant', 'desktop');
        const resultDesktop = await uploadHero(formDataDesktop);
        if (!resultDesktop.success) {
          throw new Error(resultDesktop.error || 'Desktop upload failed');
        }
        newImages.desktop = resultDesktop.data!;

        const formDataMobile = new FormData();
        formDataMobile.append('file', mobile!.file);
        formDataMobile.append('variant', 'mobile');
        const resultMobile = await uploadHero(formDataMobile);
        if (!resultMobile.success) {
          throw new Error(resultMobile.error || 'Mobile upload failed');
        }
        newImages.mobile = resultMobile.data!;

        // Delete "both" if it exists
        if (existingBoth) {
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

  const handleFeaturedProjectRemove = async (index: number) => {
    const project = featuredProjects[index];

    // Delete images from Cloudinary and DB if they exist
    if (project) {
      const result = await deleteFeaturedImages(project.slug);
      if (!result.success) {
        toast.error('Failed to delete images');
        return;
      }
    }

    // Clear from projects array and reset upload state
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
  };

  const hasHeroChanges =
    heroState.desktop !== null ||
    heroState.mobile !== null ||
    heroState.deleteDesktop ||
    heroState.deleteMobile ||
    heroState.deleteBoth ||
    heroState.convertBothTo !== null;

  // Check if project selections have changed
  const hasProjectSelectionChanges = featuredProjects.some(
    (project, index) => project?.id !== initialFeaturedProjects[index]?.id
  );

  const hasFeaturedChanges =
    hasProjectSelectionChanges ||
    featured0State.desktop !== null ||
    featured0State.mobile !== null ||
    featured0State.deleteDesktop ||
    featured0State.deleteMobile ||
    featured0State.deleteBoth ||
    featured0State.convertBothTo !== null ||
    featured1State.desktop !== null ||
    featured1State.mobile !== null ||
    featured1State.deleteDesktop ||
    featured1State.deleteMobile ||
    featured1State.deleteBoth ||
    featured1State.convertBothTo !== null ||
    featured2State.desktop !== null ||
    featured2State.mobile !== null ||
    featured2State.deleteDesktop ||
    featured2State.deleteMobile ||
    featured2State.deleteBoth ||
    featured2State.convertBothTo !== null ||
    featured3State.desktop !== null ||
    featured3State.mobile !== null ||
    featured3State.deleteDesktop ||
    featured3State.deleteMobile ||
    featured3State.deleteBoth ||
    featured3State.convertBothTo !== null;

  if (isLoading) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-light tracking-item-subheading uppercase">
          HERO
        </h2>

        <MediaToolbar
          previewMode={heroState.previewMode}
          onPreviewModeChange={heroActions.setPreviewMode}
          hasChanges={hasHeroChanges}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={heroActions.reset}
        />

        {/* Upload Box */}
        <div
          className={
            heroState.previewMode === 'desktop'
              ? 'w-full max-w-md'
              : 'w-full max-w-[280px] md:max-w-[320px]'
          }
        >
          <MediaUploadBox
            label={heroState.previewMode === 'desktop' ? 'Desktop' : 'Mobile'}
            aspectRatio={heroState.previewMode === 'desktop' ? '16/9' : '9/16'}
            accept="image"
            currentMedia={heroPreview.currentMedia}
            onFileSelect={
              heroState.previewMode === 'desktop'
                ? heroActions.setDesktop
                : heroActions.setMobile
            }
            onRemove={
              heroState.previewMode === 'desktop'
                ? heroActions.removeDesktop
                : heroActions.removeMobile
            }
            isRemovable={heroPreview.isRemovable}
          />
        </div>
      </section>

      {/* Featured Section */}
      <section className="space-y-6 mb-4">
        <h2 className="text-xl font-light tracking-item-subheading uppercase">
          FEATURED PROJECTS
        </h2>

        <MediaToolbar
          hasChanges={hasFeaturedChanges}
          isSaving={isSaving}
          onSave={handleSaveAllFeatured}
          onReset={handleResetFeatured}
          previewMode={sectionPreview}
          onPreviewModeChange={setSectionPreview}
        />

        <FeaturedSlideshow>
          <FeaturedSlot
            project={featuredProjects[0]}
            previewMode={sectionPreview}
            currentMedia={featured0Preview.currentMedia}
            isRemovable={featured0Preview.isRemovable}
            actions={featured0Actions}
            onSelect={() => handleFeaturedSelect(0)}
            onProjectRemove={() => handleFeaturedProjectRemove(0)}
          />
          <FeaturedSlot
            project={featuredProjects[1]}
            previewMode={sectionPreview}
            currentMedia={featured1Preview.currentMedia}
            isRemovable={featured1Preview.isRemovable}
            actions={featured1Actions}
            onSelect={() => handleFeaturedSelect(1)}
            onProjectRemove={() => handleFeaturedProjectRemove(1)}
          />
          <FeaturedSlot
            project={featuredProjects[2]}
            previewMode={sectionPreview}
            currentMedia={featured2Preview.currentMedia}
            isRemovable={featured2Preview.isRemovable}
            actions={featured2Actions}
            onSelect={() => handleFeaturedSelect(2)}
            onProjectRemove={() => handleFeaturedProjectRemove(2)}
          />
          <FeaturedSlot
            project={featuredProjects[3]}
            previewMode={sectionPreview}
            currentMedia={featured3Preview.currentMedia}
            isRemovable={featured3Preview.isRemovable}
            actions={featured3Actions}
            onSelect={() => handleFeaturedSelect(3)}
            onProjectRemove={() => handleFeaturedProjectRemove(3)}
          />
        </FeaturedSlideshow>
      </section>

      {/* Project Selector Dialog */}
      <ProjectSelectorDialog
        isOpen={selectorOpen}
        projects={availableProjects.map((p) => ({
          id: p.slug,
          title: p.title,
          slug: p.slug,
        }))}
        onClose={() => {
          setSelectorOpen(false);
          setSelectedSlotIndex(null);
        }}
        onSelect={handleProjectSelect}
      />
    </div>
  );
}

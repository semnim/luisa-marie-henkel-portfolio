'use client';

import { deleteHero, fetchCurrentHero, uploadHero } from '@/app/actions/hero';
import { FeaturedProjectCard } from '@/components/admin/featured-project-card';
import { MediaUploadBox } from '@/components/admin/media-upload-box';
import { ProjectSelectorDialog } from '@/components/admin/project-selector-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Image } from '@/lib/schema';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MediaPreview {
  file: File;
  url: string;
  type: 'image' | 'video';
}

// Mock projects data for now
const mockProjects = [
  { id: '1', title: 'Sunrise Collection Editorial' },
  { id: '2', title: 'Urban Nights Campaign' },
  { id: '3', title: 'Minimalist Lifestyle Series' },
  { id: '4', title: 'Fashion Week Backstage' },
  { id: '5', title: 'Architectural Perspectives' },
];

interface FeaturedProject {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

export default function AdminHomePage() {
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>(
    'image'
  );

  // Hero upload states
  const [useForBoth, setUseForBoth] = useState(false);
  const [mobileDesktopView, setMobileDesktopView] = useState<
    'desktop' | 'mobile'
  >('desktop');
  const [heroDesktop, setHeroDesktop] = useState<MediaPreview | null>(null);
  const [heroMobile, setHeroMobile] = useState<MediaPreview | null>(null);
  const [heroMedia, setHeroMedia] = useState<MediaPreview | null>(null); // For "both" mode

  // Track existing DB images
  const [existingDesktop, setExistingDesktop] = useState<Image | null>(null);
  const [existingMobile, setExistingMobile] = useState<Image | null>(null);
  const [existingBoth, setExistingBoth] = useState<Image | null>(null);

  // UI states
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [featuredProjects, setFeaturedProjects] = useState<
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

  // Fetch existing hero images on mount
  useEffect(() => {
    async function loadHeroImages() {
      const result = await fetchCurrentHero();
      if (result.success && result.data) {
        if (result.data.both) {
          setUseForBoth(true);
          setExistingBoth(result.data.both);
        } else {
          setUseForBoth(false);
          if (result.data.desktop) setExistingDesktop(result.data.desktop);
          if (result.data.mobile) setExistingMobile(result.data.mobile);
        }
      }
      setIsLoading(false);
    }
    loadHeroImages();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
      if (heroMobile) URL.revokeObjectURL(heroMobile.url);
      if (heroMedia) URL.revokeObjectURL(heroMedia.url);
    };
  }, [heroDesktop, heroMobile, heroMedia]);

  const handleHeroDesktopSelect = (file: File) => {
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setHeroDesktop({ file, url, type });
  };

  const handleHeroMobileSelect = (file: File) => {
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setHeroMobile({ file, url, type });
  };

  const handleHeroMediaSelect = (file: File) => {
    if (heroMedia) URL.revokeObjectURL(heroMedia.url);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setHeroMedia({ file, url, type });
  };

  const handleHeroDesktopRemove = () => {
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
    setHeroDesktop(null);
  };

  const handleHeroMobileRemove = () => {
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    setHeroMobile(null);
  };

  const handleHeroMediaRemove = () => {
    if (heroMedia) URL.revokeObjectURL(heroMedia.url);
    setHeroMedia(null);
  };

  const handleToggleUseForBoth = () => {
    if (!useForBoth) {
      // Switching to "both" mode: keep desktop as unified
      if (heroDesktop) {
        setHeroMedia(heroDesktop);
        setHeroDesktop(null);
      }
      if (heroMobile) {
        URL.revokeObjectURL(heroMobile.url);
        setHeroMobile(null);
      }
    } else {
      // Switching to separate mode: keep unified as desktop
      if (heroMedia) {
        setHeroDesktop(heroMedia);
        setHeroMedia(null);
      }
    }
    setUseForBoth(!useForBoth);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (useForBoth) {
        // Upload "both" variant
        if (heroMedia) {
          const formData = new FormData();
          formData.append('file', heroMedia.file);
          formData.append('variant', 'both');
          const result = await uploadHero(formData);
          if (!result.success) {
            throw new Error(result.error || 'Upload failed');
          }
          setExistingBoth(result.data!);
        }

        // Delete desktop and mobile if they exist
        if (existingDesktop) {
          await deleteHero('desktop');
          setExistingDesktop(null);
        }
        if (existingMobile) {
          await deleteHero('mobile');
          setExistingMobile(null);
        }
      } else {
        // Upload desktop variant
        if (heroDesktop) {
          const formData = new FormData();
          formData.append('file', heroDesktop.file);
          formData.append('variant', 'desktop');
          const result = await uploadHero(formData);
          if (!result.success) {
            throw new Error(result.error || 'Desktop upload failed');
          }
          setExistingDesktop(result.data!);
        }

        // Upload mobile variant
        if (heroMobile) {
          const formData = new FormData();
          formData.append('file', heroMobile.file);
          formData.append('variant', 'mobile');
          const result = await uploadHero(formData);
          if (!result.success) {
            throw new Error(result.error || 'Mobile upload failed');
          }
          setExistingMobile(result.data!);
        }

        // Delete "both" if it exists
        if (existingBoth) {
          await deleteHero('both');
          setExistingBoth(null);
        }
      }

      // Clear preview states
      if (heroDesktop) {
        URL.revokeObjectURL(heroDesktop.url);
        setHeroDesktop(null);
      }
      if (heroMobile) {
        URL.revokeObjectURL(heroMobile.url);
        setHeroMobile(null);
      }
      if (heroMedia) {
        URL.revokeObjectURL(heroMedia.url);
        setHeroMedia(null);
      }

      toast.success('Saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete all hero images?')) return;

    setIsSaving(true);
    try {
      if (existingBoth) {
        await deleteHero('both');
        setExistingBoth(null);
      }
      if (existingDesktop) {
        await deleteHero('desktop');
        setExistingDesktop(null);
      }
      if (existingMobile) {
        await deleteHero('mobile');
        setExistingMobile(null);
      }

      // Clear preview states
      if (heroDesktop) {
        URL.revokeObjectURL(heroDesktop.url);
        setHeroDesktop(null);
      }
      if (heroMobile) {
        URL.revokeObjectURL(heroMobile.url);
        setHeroMobile(null);
      }
      if (heroMedia) {
        URL.revokeObjectURL(heroMedia.url);
        setHeroMedia(null);
      }

      toast.success('Deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Delete failed');
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
      updated[selectedSlotIndex] = project;
      setFeaturedProjects(updated);
    }
    setSelectorOpen(false);
    setSelectedSlotIndex(null);
  };

  const handleFeaturedRemove = (index: number) => {
    const updated = [...featuredProjects] as [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ];
    updated[index] = undefined;
    setFeaturedProjects(updated);
  };

  const hasChanges =
    heroDesktop !== null || heroMobile !== null || heroMedia !== null;

  if (isLoading) {
    return (
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 space-y-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light tracking-item-subheading uppercase">
            HERO
          </h2>
          <div className="flex gap-3">
            {(existingDesktop || existingMobile || existingBoth) && (
              <button
                onClick={handleDeleteAll}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-light tracking-item-subheading uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
              >
                Delete All
              </button>
            )}
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-light tracking-item-subheading uppercase bg-foreground text-background hover:opacity-80 transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Media Type Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setHeroMediaType('image')}
            className={`px-6 py-2 text-sm font-light tracking-item-subheading uppercase transition-all duration-300 ${
              heroMediaType === 'image'
                ? 'bg-foreground text-background'
                : 'border border-muted-foreground/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            IMAGE
          </button>
          <button
            disabled
            onClick={() => setHeroMediaType('video')}
            className={`px-6 py-2 text-sm font-light tracking-item-subheading uppercase transition-all duration-300 ${
              heroMediaType === 'video'
                ? 'bg-foreground text-background'
                : 'border border-muted-foreground/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            VIDEO
          </button>
        </div>

        {/* Use For Both Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-for-both"
              checked={useForBoth}
              onCheckedChange={handleToggleUseForBoth}
            />
            <Label htmlFor="use-for-both" className="text-xs font-light">
              Use for both (desktop & mobile)
            </Label>
          </div>
        </div>

        {/* Upload Boxes */}
        {useForBoth ? (
          <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => setMobileDesktopView('desktop')}
                className={`px-4 py-1 text-xs font-light tracking-item-subheading uppercase transition-all duration-300 ${
                  mobileDesktopView === 'desktop'
                    ? 'bg-foreground text-background'
                    : 'border border-muted-foreground/40 text-muted-foreground'
                }`}
              >
                Desktop Preview
              </button>
              <button
                onClick={() => setMobileDesktopView('mobile')}
                className={`px-4 py-1 text-xs font-light tracking-item-subheading uppercase transition-all duration-300 ${
                  mobileDesktopView === 'mobile'
                    ? 'bg-foreground text-background'
                    : 'border border-muted-foreground/40 text-muted-foreground'
                }`}
              >
                Mobile Preview
              </button>
            </div>

            {/* Single Upload Box */}
            <div
              className={
                mobileDesktopView === 'desktop'
                  ? 'w-full max-w-md'
                  : 'w-full max-w-[280px] md:max-w-[320px]'
              }
            >
              <MediaUploadBox
                label={
                  mobileDesktopView === 'desktop'
                    ? 'Both (Desktop Preview)'
                    : 'Both (Mobile Preview)'
                }
                aspectRatio={mobileDesktopView === 'desktop' ? '16/9' : '9/16'}
                accept={heroMediaType}
                currentMedia={
                  heroMedia
                    ? {
                        url: heroMedia.url,
                        filename: heroMedia.file.name,
                        type: heroMedia.type,
                      }
                    : existingBoth
                    ? {
                        url: existingBoth.imageUrl,
                        filename: 'Existing image',
                        type: 'image',
                      }
                    : {
                        url: '/assets/home_hero.webp',
                        filename: 'Fallback image',
                        type: 'image',
                      }
                }
                onFileSelect={handleHeroMediaSelect}
                onRemove={handleHeroMediaRemove}
                isRemovable={!!(heroMedia || existingBoth)}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="w-full max-w-md">
              <MediaUploadBox
                label="Desktop"
                aspectRatio="16/9"
                accept={heroMediaType}
                currentMedia={
                  heroDesktop
                    ? {
                        url: heroDesktop.url,
                        filename: heroDesktop.file.name,
                        type: heroDesktop.type,
                      }
                    : existingDesktop
                    ? {
                        url: existingDesktop.imageUrl,
                        filename: 'Existing desktop image',
                        type: 'image',
                      }
                    : {
                        url: '/assets/home_hero.webp',
                        filename: 'Fallback image',
                        type: 'image',
                      }
                }
                onFileSelect={handleHeroDesktopSelect}
                onRemove={handleHeroDesktopRemove}
                isRemovable={!!(heroDesktop || existingDesktop)}
              />
            </div>
            <div className="w-full max-w-[280px] md:max-w-[320px]">
              <MediaUploadBox
                label="Mobile"
                aspectRatio="9/16"
                accept={heroMediaType}
                currentMedia={
                  heroMobile
                    ? {
                        url: heroMobile.url,
                        filename: heroMobile.file.name,
                        type: heroMobile.type,
                      }
                    : existingMobile
                    ? {
                        url: existingMobile.imageUrl,
                        filename: 'Existing mobile image',
                        type: 'image',
                      }
                    : {
                        url: '/assets/home_hero.webp',
                        filename: 'Fallback image',
                        type: 'image',
                      }
                }
                onFileSelect={handleHeroMobileSelect}
                onRemove={handleHeroMobileRemove}
                isRemovable={!!(heroMobile || existingMobile)}
              />
            </div>
          </div>
        )}
      </section>

      {/* Featured Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-light tracking-item-subheading uppercase">
          FEATURED PROJECTS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectCard
              key={index}
              project={project}
              onSelect={() => handleFeaturedSelect(index)}
              onRemove={() => handleFeaturedRemove(index)}
            />
          ))}
        </div>
      </section>

      {/* Project Selector Dialog */}
      <ProjectSelectorDialog
        isOpen={selectorOpen}
        projects={mockProjects}
        onClose={() => {
          setSelectorOpen(false);
          setSelectedSlotIndex(null);
        }}
        onSelect={handleProjectSelect}
      />
    </div>
  );
}

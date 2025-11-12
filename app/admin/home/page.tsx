'use client';

import { FeaturedProjectCard } from '@/components/admin/featured-project-card';
import { MediaUploadBox } from '@/components/admin/media-upload-box';
import { ProjectSelectorDialog } from '@/components/admin/project-selector-dialog';
import { Project } from '@/lib/schema';
import { useState, useEffect } from 'react';

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
  const [heroDesktop, setHeroDesktop] = useState<MediaPreview | null>(null);
  const [heroMobile, setHeroMobile] = useState<MediaPreview | null>(null);
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

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
      if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    };
  }, [heroDesktop, heroMobile]);

  const handleHeroDesktopSelect = (file: File) => {
    // Cleanup old URL
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setHeroDesktop({ file, url, type });
  };

  const handleHeroMobileSelect = (file: File) => {
    // Cleanup old URL
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setHeroMobile({ file, url, type });
  };

  const handleHeroDesktopRemove = () => {
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
    setHeroDesktop(null);
  };

  const handleHeroMobileRemove = () => {
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    setHeroMobile(null);
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

  return (
    <div className="px-6 py-12 space-y-16 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-light tracking-item-subheading uppercase">
          HERO
        </h2>

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

        {/* Upload Boxes */}
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
                  : undefined
              }
              onFileSelect={handleHeroDesktopSelect}
              onRemove={handleHeroDesktopRemove}
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
                  : undefined
              }
              onFileSelect={handleHeroMobileSelect}
              onRemove={handleHeroMobileRemove}
            />
          </div>
        </div>
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

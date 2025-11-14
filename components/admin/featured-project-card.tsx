'use client';

import { Monitor, MonitorSmartphone, Plus, Smartphone, X } from 'lucide-react';
import Image from 'next/image';

interface FeaturedProject {
  id: string;
  title: string;
  thumbnailUrl?: string;
}

interface ExistingImages {
  desktop?: { imageUrl: string };
  mobile?: { imageUrl: string };
  both?: { imageUrl: string };
}

interface FeaturedProjectCardProps {
  project?: FeaturedProject;
  aspectRatio?: '16/9' | '9/16';
  images?: ExistingImages;
  onSelect?: () => void;
  onRemove?: () => void;
  onVariantClick?: (variant: 'desktop' | 'mobile' | 'both') => void;
}

export function FeaturedProjectCard({
  project,
  aspectRatio = '16/9',
  images,
  onSelect,
  onRemove,
  onVariantClick,
}: FeaturedProjectCardProps) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  const handleVariantClick = (
    e: React.MouseEvent,
    variant: 'desktop' | 'mobile' | 'both'
  ) => {
    e.stopPropagation();
    onVariantClick?.(variant);
  };

  // Determine background image
  const backgroundImage =
    aspectRatio === '16/9'
      ? images?.both?.imageUrl || images?.desktop?.imageUrl
      : images?.mobile?.imageUrl || images?.both?.imageUrl;

  const isDesktopActive = !!images?.desktop;
  const isMobileActive = !!images?.mobile;
  const isBothActive = !!images?.both;
  const isBothDisabled = !!(images?.desktop || images?.mobile);

  return (
    <div
      onClick={onSelect}
      className={`relative w-full bg-background border ${
        project
          ? 'border-muted-foreground/40'
          : 'border-dashed border-muted-foreground/40'
      } transition-colors duration-300 overflow-hidden group cursor-pointer`}
      style={{ aspectRatio }}
    >
      {/* Background Image */}
      {project && backgroundImage && (
        <Image
          src={backgroundImage}
          alt={project.title}
          fill
          className="object-cover"
        />
      )}

      {/* Content */}
      {project ? (
        <>
          {/* Project Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-3">
            <p className="text-xs font-light tracking-item-subheading uppercase text-foreground truncate">
              {project.title}
            </p>
          </div>

          {/* Variant Icons Overlay (Center) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="grid grid-cols-2 gap-3 bg-background/80 p-4 rounded">
              {/* Desktop */}
              <button
                onClick={(e) => handleVariantClick(e, 'desktop')}
                className="p-3 border border-muted-foreground/40 hover:border-foreground transition-colors"
              >
                <Monitor
                  className={`w-6 h-6 ${
                    isDesktopActive ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                  strokeWidth={1}
                />
              </button>

              {/* Both */}
              <button
                onClick={(e) =>
                  !isBothDisabled && handleVariantClick(e, 'both')
                }
                disabled={isBothDisabled}
                className="p-3 border border-muted-foreground/40 hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <MonitorSmartphone
                  className={`w-6 h-6 ${
                    isBothActive ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                  strokeWidth={1}
                />
              </button>

              {/* Mobile */}
              <button
                onClick={(e) => handleVariantClick(e, 'mobile')}
                className="p-3 border border-muted-foreground/40 hover:border-foreground transition-colors"
              >
                <Smartphone
                  className={`w-6 h-6 ${
                    isMobileActive ? 'text-green-500' : 'text-muted-foreground'
                  }`}
                  strokeWidth={1}
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-light tracking-item-subheading uppercase text-muted-foreground">
            SELECT PROJECT
          </span>
        </div>
      )}

      {/* Hover Overlay (only when no project) */}
      {!project && (
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Plus className="w-12 h-12 text-foreground" strokeWidth={1} />
        </div>
      )}

      {/* Remove Button */}
      {project && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-3 right-3 p-2 bg-transparent rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:text-red-400 z-10"
          aria-label="Remove project"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}

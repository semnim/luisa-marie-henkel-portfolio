'use client';

import { PortfolioProjectItem } from '@/app/admin/portfolio/page';
import {
  Check,
  ChevronDown,
  FileImage,
  Image,
  RectangleHorizontal,
  RectangleVertical,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { AnimatedBorderButton } from '../auth/animated-border-button';

interface Project {
  id: string;
  title: string;
  category: string;
  hasDesktopHero: boolean;
  hasMobileHero: boolean;
  hasDesktopThumb: boolean;
  hasMobileThumb: boolean;
  galleryCount: number;
}

interface ProjectListItemProps {
  project: PortfolioProjectItem;
  onEditMetadata?: () => void;
  onManageMedia?: () => void;
  onManageGallery?: () => void;
  onDelete?: () => void;
}

export function ProjectListItem({
  project,
  onEditMetadata,
  onManageMedia,
  onManageGallery,
  onDelete,
}: ProjectListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b hover:bg-muted-foreground/5 border-muted-foreground/20 last:border-b-0">
      {/* Collapsed View */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 transition-colors duration-300"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          {/* Title & Category */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <h3 className="font-light text-sm truncate flex-1 text-left">
              {project.title}
            </h3>
            <span className="px-2 py-1 text-xs font-light tracking-wider uppercase text-muted-foreground rounded-sm whitespace-nowrap">
              {project.category}
            </span>
          </div>

          {/* Media Status, Gallery Count, Expand Arrow */}
          <div className="flex items-center gap-4">
            {/* Media Status Icons */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <span title="Desktop Hero" className="flex items-center gap-1">
                <RectangleHorizontal
                  className="w-3.5 h-3.5"
                  strokeWidth={1.5}
                />
                {project.hasDesktopHero ? (
                  <Check className="w-3 h-3 text-green-500" strokeWidth={2} />
                ) : (
                  <X className="w-3 h-3 text-red-500" strokeWidth={2} />
                )}
              </span>
              <span title="Mobile Hero" className="flex items-center gap-1">
                <RectangleVertical className="w-3.5 h-3.5" strokeWidth={1.5} />
                {project.hasMobileHero ? (
                  <Check className="w-3 h-3 text-green-500" strokeWidth={2} />
                ) : (
                  <X className="w-3 h-3 text-red-500" strokeWidth={2} />
                )}
              </span>
              <span
                title="Desktop Thumbnail"
                className="flex items-center gap-1"
              >
                <Image className="w-3.5 h-3.5" strokeWidth={1.5} />
                {project.hasDesktopThumb ? (
                  <Check className="w-3 h-3 text-green-500" strokeWidth={2} />
                ) : (
                  <X className="w-3 h-3 text-red-500" strokeWidth={2} />
                )}
              </span>
              <span
                title="Mobile Thumbnail"
                className="flex items-center gap-1"
              >
                <FileImage className="w-3.5 h-3.5" strokeWidth={1.5} />
                {project.hasMobileThumb ? (
                  <Check className="w-3 h-3 text-green-500" strokeWidth={2} />
                ) : (
                  <X className="w-3 h-3 text-red-500" strokeWidth={2} />
                )}
              </span>
            </div>

            {/* Gallery Count */}
            <div className="text-xs text-muted-foreground font-light whitespace-nowrap">
              {project.galleryCount} images
            </div>

            {/* Expand Arrow */}
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-500 ease-out ml-auto ${
                isExpanded ? 'rotate-180' : ''
              }`}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </button>

      {/* Expanded Actions */}
      {isExpanded && (
        <div className="px-6 pb-4 flex flex-col lg:flex-row gap-2 lg:gap-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
          <AnimatedBorderButton
            onClick={onEditMetadata}
            className="w-full text-sm"
          >
            edit
          </AnimatedBorderButton>
          <AnimatedBorderButton
            onClick={onManageMedia}
            className="w-full text-sm"
          >
            media
          </AnimatedBorderButton>
          <AnimatedBorderButton
            onClick={onManageGallery}
            className="w-full text-sm"
          >
            gallery
          </AnimatedBorderButton>
          <AnimatedBorderButton
            onClick={onDelete}
            className="w-full text-sm text-red-500 hover:text-red-400"
          >
            DELETE
          </AnimatedBorderButton>
        </div>
      )}
    </div>
  );
}

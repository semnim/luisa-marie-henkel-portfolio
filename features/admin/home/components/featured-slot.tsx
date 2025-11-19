'use client';

import type { MediaUploadActions } from '@/features/admin/hooks';
import { X } from 'lucide-react';
import { MediaUploadBox } from '@/features/admin/portfolio/components/media-upload-box';

interface FeaturedSlotProps {
  project?: {
    id: string;
    title: string;
    slug: string;
  };
  previewMode: 'desktop' | 'mobile';
  currentMedia?: {
    url: string;
    filename: string;
    type: 'image' | 'video';
  };
  isRemovable: boolean;
  actions: MediaUploadActions;
  onSelect: () => void;
  onProjectRemove: () => void;
}

export function FeaturedSlot({
  project,
  previewMode,
  currentMedia,
  isRemovable,
  actions,
  onSelect,
  onProjectRemove,
}: FeaturedSlotProps) {
  if (!project) {
    return (
      <div className="flex-1 space-y-2">
        <div
          onClick={onSelect}
          className="w-full bg-muted/20 border border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
          style={{ aspectRatio: '9/16' }}
        >
          <p className="text-sm text-muted-foreground tracking-item-heading">
            Select Project
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2">
      <MediaUploadBox
        aspectRatio="9/16"
        accept="image"
        currentMedia={currentMedia}
        onFileSelect={
          previewMode === 'desktop' ? actions.setDesktop : actions.setMobile
        }
        onRemove={
          previewMode === 'desktop'
            ? actions.removeDesktop
            : actions.removeMobile
        }
        isRemovable={isRemovable}
      />
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[10px] lg:text-[10px] font-light tracking-item-subheading uppercase text-foreground">
          {project.title}
        </h3>
        <button
          onClick={onProjectRemove}
          className="text-xs hover:text-red-500 uppercase tracking-item-subheading shrink-0 flex justify-start items-start cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

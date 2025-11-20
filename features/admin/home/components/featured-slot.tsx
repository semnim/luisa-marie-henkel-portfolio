'use client';

import type { MediaUploadActions } from '@/features/admin/hooks';
import { MediaUploadBox } from '@/features/admin/portfolio/components/media-upload-box';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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
  isMobileSlideshow?: boolean;
}

export function FeaturedSlot({
  project,
  previewMode,
  currentMedia,
  isRemovable,
  actions,
  onSelect,
  onProjectRemove,
  isMobileSlideshow = false,
}: FeaturedSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Error: File can be max. 2MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      const onFileSelect = previewMode === 'desktop' ? actions.setDesktop : actions.setMobile;
      onFileSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!project) {
    return (
      <div className={isMobileSlideshow ? 'h-full flex flex-col' : 'flex-1 space-y-2'}>
        <div
          onClick={onSelect}
          className={`w-full bg-muted/20 border border-dashed border-muted-foreground/40 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors ${isMobileSlideshow ? 'flex-1' : ''}`}
          style={isMobileSlideshow ? {} : { aspectRatio: '9/16' }}
        >
          <p className="text-sm text-muted-foreground tracking-item-heading">
            Select Project
          </p>
        </div>
      </div>
    );
  }

  if (isMobileSlideshow) {
    return (
      <div className="h-full flex flex-col">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Image container - fills available space */}
        <div className="flex-1 min-h-0 relative bg-muted/20">
          {currentMedia ? (
            <>
              {currentMedia.type === 'image' ? (
                <Image
                  src={currentMedia.url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={currentMedia.url}
                  className="w-full h-full object-cover"
                  muted
                />
              )}
              {/* Clickable overlay for edit */}
              <div
                onClick={triggerFileInput}
                className="absolute inset-0 opacity-0 hover:opacity-100 bg-background/80 transition-opacity duration-300 flex items-center justify-center cursor-pointer z-5"
              >
                <p className="text-sm text-foreground">Change Image</p>
              </div>
            </>
          ) : (
            <div
              onClick={triggerFileInput}
              className="w-full h-full flex items-center justify-center cursor-pointer border border-dashed border-muted-foreground/40 hover:bg-muted/30 transition-colors"
            >
              <p className="text-sm text-muted-foreground tracking-item-heading">
                Upload Image
              </p>
            </div>
          )}
          {/* Remove button overlay */}
          {currentMedia && isRemovable && (
            <button
              onClick={
                previewMode === 'desktop'
                  ? actions.removeDesktop
                  : actions.removeMobile
              }
              className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10 cursor-pointer"
              aria-label="Remove media"
            >
              <X className="w-4 h-4 text-white" strokeWidth={1.5} />
            </button>
          )}
        </div>
        {/* Filename */}
        <div className="shrink-0 px-1 pt-3">
          <p className="text-xs text-muted-foreground font-light truncate">
            {currentMedia ? currentMedia.filename : '–'}
          </p>
        </div>
        {/* Title - natural height */}
        <div className="shrink-0 flex items-start justify-between gap-2 pb-3 px-1">
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

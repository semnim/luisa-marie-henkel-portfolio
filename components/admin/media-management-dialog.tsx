'use client';

import { useState, useEffect } from 'react';
import { MediaUploadBox } from './media-upload-box';
import { AnimatedBorderButton } from '../auth/animated-border-button';

interface MediaData {
  url: string;
  filename: string;
  type: 'image' | 'video';
}

interface ProjectMedia {
  heroDesktop?: MediaData;
  heroMobile?: MediaData;
  thumbnailDesktop?: MediaData;
  thumbnailMobile?: MediaData;
}

interface MediaManagementDialogProps {
  isOpen: boolean;
  projectTitle: string;
  currentMedia?: ProjectMedia;
  onClose: () => void;
  onSave?: (media: ProjectMedia) => void;
}

interface MediaFile {
  file: File;
  url: string;
  type: 'image' | 'video';
}

export function MediaManagementDialog({
  isOpen,
  projectTitle,
  currentMedia,
  onClose,
  onSave,
}: MediaManagementDialogProps) {
  const [heroDesktop, setHeroDesktop] = useState<MediaFile | null>(null);
  const [heroMobile, setHeroMobile] = useState<MediaFile | null>(null);
  const [thumbnailDesktop, setThumbnailDesktop] = useState<MediaFile | null>(
    null
  );
  const [thumbnailMobile, setThumbnailMobile] = useState<MediaFile | null>(
    null
  );

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
      if (heroMobile) URL.revokeObjectURL(heroMobile.url);
      if (thumbnailDesktop) URL.revokeObjectURL(thumbnailDesktop.url);
      if (thumbnailMobile) URL.revokeObjectURL(thumbnailMobile.url);
    };
  }, [heroDesktop, heroMobile, thumbnailDesktop, thumbnailMobile]);

  const createMediaFile = (file: File): MediaFile => {
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    return { file, url, type };
  };

  const handleHeroDesktopSelect = (file: File) => {
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
    setHeroDesktop(createMediaFile(file));
  };

  const handleHeroMobileSelect = (file: File) => {
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    setHeroMobile(createMediaFile(file));
  };

  const handleThumbnailDesktopSelect = (file: File) => {
    if (thumbnailDesktop) URL.revokeObjectURL(thumbnailDesktop.url);
    setThumbnailDesktop(createMediaFile(file));
  };

  const handleThumbnailMobileSelect = (file: File) => {
    if (thumbnailMobile) URL.revokeObjectURL(thumbnailMobile.url);
    setThumbnailMobile(createMediaFile(file));
  };

  const handleHeroDesktopRemove = () => {
    if (heroDesktop) URL.revokeObjectURL(heroDesktop.url);
    setHeroDesktop(null);
  };

  const handleHeroMobileRemove = () => {
    if (heroMobile) URL.revokeObjectURL(heroMobile.url);
    setHeroMobile(null);
  };

  const handleThumbnailDesktopRemove = () => {
    if (thumbnailDesktop) URL.revokeObjectURL(thumbnailDesktop.url);
    setThumbnailDesktop(null);
  };

  const handleThumbnailMobileRemove = () => {
    if (thumbnailMobile) URL.revokeObjectURL(thumbnailMobile.url);
    setThumbnailMobile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-6 bg-background/95 overflow-y-auto">
      <div className="w-full max-w-5xl py-12">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-xl font-light tracking-item-subheading uppercase mb-2">
              MANAGE MEDIA
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              {projectTitle}
            </p>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
              Hero Images
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="w-full max-w-md mx-auto md:mx-0">
                <MediaUploadBox
                  label="Desktop"
                  aspectRatio="16/9"
                  accept="both"
                  currentMedia={
                    heroDesktop
                      ? {
                          url: heroDesktop.url,
                          filename: heroDesktop.file.name,
                          type: heroDesktop.type,
                        }
                      : currentMedia?.heroDesktop
                  }
                  onFileSelect={handleHeroDesktopSelect}
                  onRemove={handleHeroDesktopRemove}
                />
              </div>
              <div className="w-full max-w-[280px] md:max-w-[320px] mx-auto md:mx-0">
                <MediaUploadBox
                  label="Mobile"
                  aspectRatio="9/16"
                  accept="both"
                  currentMedia={
                    heroMobile
                      ? {
                          url: heroMobile.url,
                          filename: heroMobile.file.name,
                          type: heroMobile.type,
                        }
                      : currentMedia?.heroMobile
                  }
                  onFileSelect={handleHeroMobileSelect}
                  onRemove={handleHeroMobileRemove}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
              Thumbnails
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="w-full max-w-md mx-auto md:mx-0">
                <MediaUploadBox
                  label="Desktop"
                  aspectRatio="16/9"
                  accept="image"
                  currentMedia={
                    thumbnailDesktop
                      ? {
                          url: thumbnailDesktop.url,
                          filename: thumbnailDesktop.file.name,
                          type: thumbnailDesktop.type,
                        }
                      : currentMedia?.thumbnailDesktop
                  }
                  onFileSelect={handleThumbnailDesktopSelect}
                  onRemove={handleThumbnailDesktopRemove}
                />
              </div>
              <div className="w-full max-w-[280px] md:max-w-[320px] mx-auto md:mx-0">
                <MediaUploadBox
                  label="Mobile"
                  aspectRatio="9/16"
                  accept="image"
                  currentMedia={
                    thumbnailMobile
                      ? {
                          url: thumbnailMobile.url,
                          filename: thumbnailMobile.file.name,
                          type: thumbnailMobile.type,
                        }
                      : currentMedia?.thumbnailMobile
                  }
                  onFileSelect={handleThumbnailMobileSelect}
                  onRemove={handleThumbnailMobileRemove}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <AnimatedBorderButton onClick={onClose} className="flex-1">
              CANCEL
            </AnimatedBorderButton>
            <AnimatedBorderButton
              onClick={() => onSave?.(currentMedia || {})}
              className="flex-1"
            >
              SAVE
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}

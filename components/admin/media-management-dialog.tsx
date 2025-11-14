'use client';

import { saveProjectMedia } from '@/app/actions/project-media';
import { useMediaPreview } from '@/hooks/use-media-preview';
import { useMediaUploadState } from '@/hooks/use-media-upload-state';
import { Image } from '@/lib/schema';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimatedBorderButton } from '../auth/animated-border-button';
import { MediaToolbar } from './media-toolbar';
import { MediaUploadBox } from './media-upload-box';

interface MediaManagementDialogProps {
  isOpen: boolean;
  projectId: number;
  projectTitle: string;
  existingImages: Image[];
  onClose: () => void;
  onSave?: () => void;
}

export function MediaManagementDialog({
  isOpen,
  projectId,
  projectTitle,
  existingImages,
  onClose,
  onSave,
}: MediaManagementDialogProps) {
  // Shared preview mode across both sections
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  // Hero state
  const [heroState, heroActions] = useMediaUploadState();
  const heroPreview = useMediaPreview(heroState, undefined, previewMode);

  // Thumbnail state
  const [thumbnailState, thumbnailActions] = useMediaUploadState();
  const thumbnailPreview = useMediaPreview(thumbnailState, undefined, previewMode);

  // Load existing images when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Filter hero images
      const heroDesktop = existingImages.find(
        (img) => img.imageType === 'project_hero' && img.variant === 'desktop'
      );
      const heroMobile = existingImages.find(
        (img) => img.imageType === 'project_hero' && img.variant === 'mobile'
      );
      const heroBoth = existingImages.find(
        (img) => img.imageType === 'project_hero' && img.variant === 'both'
      );

      heroActions.setExistingImages({
        desktop: heroDesktop || null,
        mobile: heroMobile || null,
        both: heroBoth || null,
      });

      // Filter thumbnail images
      const thumbDesktop = existingImages.find(
        (img) => img.imageType === 'thumbnail' && img.variant === 'desktop'
      );
      const thumbMobile = existingImages.find(
        (img) => img.imageType === 'thumbnail' && img.variant === 'mobile'
      );
      const thumbBoth = existingImages.find(
        (img) => img.imageType === 'thumbnail' && img.variant === 'both'
      );

      thumbnailActions.setExistingImages({
        desktop: thumbDesktop || null,
        mobile: thumbMobile || null,
        both: thumbBoth || null,
      });
    }
  }, [isOpen, existingImages, heroActions, thumbnailActions]);

  // UI state
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingThumbnail, setIsSavingThumbnail] = useState(false);

  // Check for changes
  const hasHeroChanges =
    heroState.desktop !== null ||
    heroState.mobile !== null ||
    heroState.deleteDesktop ||
    heroState.deleteMobile ||
    heroState.deleteBoth ||
    heroState.convertBothTo !== null;

  const hasThumbnailChanges =
    thumbnailState.desktop !== null ||
    thumbnailState.mobile !== null ||
    thumbnailState.deleteDesktop ||
    thumbnailState.deleteMobile ||
    thumbnailState.deleteBoth ||
    thumbnailState.convertBothTo !== null;

  const handleSaveHero = async () => {
    setIsSavingHero(true);

    try {
      const files: { desktop?: File; mobile?: File } = {};

      if (heroState.desktop) {
        files.desktop = heroState.desktop.file;
      }
      if (heroState.mobile) {
        files.mobile = heroState.mobile.file;
      }

      const result = await saveProjectMedia(projectId, 'project_hero', files);

      if (result.success) {
        toast.success('Hero images saved successfully');
        heroActions.reset();
        onSave?.();
      } else {
        toast.error(result.error || 'Failed to save hero images');
      }
    } catch (error) {
      toast.error('Failed to save hero images');
      console.error('Save hero error:', error);
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleSaveThumbnail = async () => {
    setIsSavingThumbnail(true);

    try {
      const files: { desktop?: File; mobile?: File } = {};

      if (thumbnailState.desktop) {
        files.desktop = thumbnailState.desktop.file;
      }
      if (thumbnailState.mobile) {
        files.mobile = thumbnailState.mobile.file;
      }

      const result = await saveProjectMedia(projectId, 'thumbnail', files);

      if (result.success) {
        toast.success('Thumbnail images saved successfully');
        thumbnailActions.reset();
        onSave?.();
      } else {
        toast.error(result.error || 'Failed to save thumbnail images');
      }
    } catch (error) {
      toast.error('Failed to save thumbnail images');
      console.error('Save thumbnail error:', error);
    } finally {
      setIsSavingThumbnail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-6 bg-background/95 overflow-y-auto">
      <div className="w-full max-w-5xl py-4">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex justify-between">
              <h1 className="text-xl font-light tracking-item-subheading uppercase mb-2">
                MANAGE MEDIA
              </h1>
              {/* Shared Preview Toolbar */}
              <MediaToolbar
                previewMode={previewMode}
                onPreviewModeChange={setPreviewMode}
              />
            </div>
            <p className="text-sm text-muted-foreground font-light">
              {projectTitle}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Hero Section */}
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                Hero
              </h3>
              <div
                className={
                  previewMode === 'desktop'
                    ? 'w-full max-w-md'
                    : 'w-full max-w-[280px] md:max-w-[320px]'
                }
              >
                <MediaUploadBox
                  aspectRatio={previewMode === 'desktop' ? '16/9' : '9/16'}
                  accept="both"
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
              <div className="flex gap-3">
                <MediaToolbar
                  hasChanges={hasHeroChanges}
                  isSaving={isSavingHero}
                  onSave={handleSaveHero}
                  onReset={heroActions.reset}
                />
              </div>
            </div>

            {/* Thumbnail Section */}
            <div className="space-y-4 flex-1">
              <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                Thumbnail
              </h3>
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
                  currentMedia={thumbnailPreview.currentMedia}
                  onFileSelect={
                    previewMode === 'desktop'
                      ? thumbnailActions.setDesktop
                      : thumbnailActions.setMobile
                  }
                  onRemove={
                    previewMode === 'desktop'
                      ? thumbnailActions.removeDesktop
                      : thumbnailActions.removeMobile
                  }
                  isRemovable={thumbnailPreview.isRemovable}
                />
              </div>

              {/* Thumbnail Actions */}
              <div className="flex gap-3">
                <MediaToolbar
                  hasChanges={hasThumbnailChanges}
                  isSaving={isSavingThumbnail}
                  onSave={handleSaveThumbnail}
                  onReset={thumbnailActions.reset}
                />
              </div>
            </div>
          </div>
          {/* Close Button */}
          <div className="flex pt-6">
            <AnimatedBorderButton
              onClick={onClose}
              disabled={isSavingHero || isSavingThumbnail}
              className="w-full max-w-xs mx-auto"
            >
              CANCEL
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}

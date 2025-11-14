import type { MediaUploadState } from './use-media-upload-state';

export interface MediaPreviewInfo {
  url: string;
  filename: string;
  type: 'image' | 'video';
}

interface MediaPreviewResult {
  currentMedia?: MediaPreviewInfo;
  isRemovable: boolean;
}

export function useMediaPreview(
  state: MediaUploadState,
  fallbackUrl?: string,
  overridePreviewMode?: 'desktop' | 'mobile'
): MediaPreviewResult {
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
    previewMode: statePreviewMode,
  } = state;

  // Use override if provided, otherwise use state
  const previewMode = overridePreviewMode ?? statePreviewMode;

  // Determine current media based on preview mode
  const currentMedia: MediaPreviewInfo | undefined =
    previewMode === 'desktop'
      ? desktop
        ? {
            url: desktop.url,
            filename: desktop.file.name,
            type: desktop.type,
          }
        : existingDesktop && !deleteDesktop
        ? {
            url: existingDesktop.imageUrl,
            filename: 'Existing desktop image',
            type: 'image',
          }
        : existingBoth && !deleteBoth && convertBothTo !== 'mobile'
        ? {
            url: existingBoth.imageUrl,
            filename: 'Existing image',
            type: 'image',
          }
        : mobile
        ? {
            url: mobile.url,
            filename: mobile.file.name,
            type: mobile.type,
          }
        : fallbackUrl
        ? {
            url: fallbackUrl,
            filename: 'Fallback image',
            type: 'image',
          }
        : undefined
      : mobile
      ? {
          url: mobile.url,
          filename: mobile.file.name,
          type: mobile.type,
        }
      : existingMobile && !deleteMobile
      ? {
          url: existingMobile.imageUrl,
          filename: 'Existing mobile image',
          type: 'image',
        }
      : existingBoth && !deleteBoth && convertBothTo !== 'desktop'
      ? {
          url: existingBoth.imageUrl,
          filename: 'Existing image',
          type: 'image',
        }
      : desktop
      ? {
          url: desktop.url,
          filename: desktop.file.name,
          type: desktop.type,
        }
      : fallbackUrl
      ? {
          url: fallbackUrl,
          filename: 'Fallback image',
          type: 'image',
        }
      : undefined;

  // Determine if removable - true if any media is displayed
  // Even if showing opposite variant as fallback, allow remove (will remove current mode's variant)
  const isRemovable = !!currentMedia && currentMedia.url !== fallbackUrl;
  return { currentMedia, isRemovable };
}

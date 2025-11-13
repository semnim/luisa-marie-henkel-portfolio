import type { Image } from '@/lib/schema';
import { useState } from 'react';

export interface MediaPreview {
  file: File;
  url: string;
  type: 'image' | 'video';
}

export interface MediaUploadState {
  // Staged uploads
  desktop: MediaPreview | null;
  mobile: MediaPreview | null;

  // Existing DB images
  existingDesktop: Image | null;
  existingMobile: Image | null;
  existingBoth: Image | null;

  // Pending operations
  deleteDesktop: boolean;
  deleteMobile: boolean;
  deleteBoth: boolean;
  convertBothTo: 'desktop' | 'mobile' | null;

  // Preview state
  previewMode: 'desktop' | 'mobile';
}

export interface MediaUploadActions {
  setDesktop: (file: File) => void;
  setMobile: (file: File) => void;
  removeDesktop: () => void;
  removeMobile: () => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  reset: () => void;
  setExistingImages: (images: {
    desktop?: Image | null;
    mobile?: Image | null;
    both?: Image | null;
  }) => void;
}

export function useMediaUploadState(): [MediaUploadState, MediaUploadActions] {
  const [desktop, setDesktopState] = useState<MediaPreview | null>(null);
  const [mobile, setMobileState] = useState<MediaPreview | null>(null);

  const [existingDesktop, setExistingDesktop] = useState<Image | null>(null);
  const [existingMobile, setExistingMobile] = useState<Image | null>(null);
  const [existingBoth, setExistingBoth] = useState<Image | null>(null);

  const [deleteDesktop, setDeleteDesktop] = useState(false);
  const [deleteMobile, setDeleteMobile] = useState(false);
  const [deleteBoth, setDeleteBoth] = useState(false);

  const [convertBothTo, setConvertBothTo] = useState<
    'desktop' | 'mobile' | null
  >(null);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  const setDesktop = (file: File) => {
    if (desktop) URL.revokeObjectURL(desktop.url);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setDesktopState({ file, url, type });
    // Clear delete and conversion flags
    setDeleteDesktop(false);
    setDeleteBoth(false);
    setConvertBothTo(null);
  };

  const setMobile = (file: File) => {
    if (mobile) URL.revokeObjectURL(mobile.url);
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    setMobileState({ file, url, type });
    // Clear delete and conversion flags
    setDeleteMobile(false);
    setDeleteBoth(false);
    setConvertBothTo(null);
  };

  const removeDesktop = () => {
    // Clear staged upload
    if (desktop) {
      URL.revokeObjectURL(desktop.url);
      setDesktopState(null);
    }

    // Stage deletion for existing images
    if (existingDesktop) {
      setDeleteDesktop(true);
    } else if (existingBoth) {
      // If mobile was already marked for removal, delete entire "both" entry
      if (convertBothTo === 'desktop') {
        setDeleteBoth(true);
        setConvertBothTo(null);
      } else {
        // Convert "both" to "mobile" (keep mobile, remove desktop)
        setConvertBothTo('mobile');
      }
    }
  };

  const removeMobile = () => {
    // Clear staged upload
    if (mobile) {
      URL.revokeObjectURL(mobile.url);
      setMobileState(null);
    }

    // Stage deletion for existing images
    if (existingMobile) {
      setDeleteMobile(true);
    } else if (existingBoth) {
      // If desktop was already marked for removal, delete entire "both" entry
      if (convertBothTo === 'mobile') {
        setDeleteBoth(true);
        setConvertBothTo(null);
      } else {
        // Convert "both" to "desktop" (keep desktop, remove mobile)
        setConvertBothTo('desktop');
      }
    }
  };

  const reset = () => {
    // Clean up blob URLs
    if (desktop) {
      URL.revokeObjectURL(desktop.url);
      setDesktopState(null);
    }
    if (mobile) {
      URL.revokeObjectURL(mobile.url);
      setMobileState(null);
    }

    // Clear flags
    setDeleteDesktop(false);
    setDeleteMobile(false);
    setDeleteBoth(false);
    setConvertBothTo(null);
  };

  const setExistingImages = (images: {
    desktop?: Image | null;
    mobile?: Image | null;
    both?: Image | null;
  }) => {
    if (images.desktop !== undefined) setExistingDesktop(images.desktop);
    if (images.mobile !== undefined) setExistingMobile(images.mobile);
    if (images.both !== undefined) setExistingBoth(images.both);
  };

  const state: MediaUploadState = {
    desktop,
    mobile,
    existingDesktop,
    existingMobile,
    existingBoth,
    deleteDesktop,
    deleteMobile,
    deleteBoth,
    convertBothTo,
    previewMode,
  };

  const actions: MediaUploadActions = {
    setDesktop,
    setMobile,
    removeDesktop,
    removeMobile,
    setPreviewMode,
    reset,
    setExistingImages,
  };

  return [state, actions];
}

import { useState } from 'react';
import { toast } from 'sonner';
import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks/use-media-upload-state';
import type { HeroHandlersReturn } from '@/features/admin/home/types';
import { uploadHero, deleteHero, convertHero } from '@/features/home/actions/hero';
import {
  HERO_FORM_KEYS,
  HERO_IMAGE_VARIANTS,
  HERO_TOAST_MESSAGES,
} from '../constants';

export function useHeroHandlers(
  state: MediaUploadState,
  actions: MediaUploadActions
): HeroHandlersReturn {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
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
      } = state;

      // Execute pending conversion first (convert "both" to single variant)
      let updatedExistingDesktop = existingDesktop;
      let updatedExistingMobile = existingMobile;
      let updatedExistingBoth = existingBoth;

      if (convertBothTo && existingBoth) {
        const result = await convertHero(convertBothTo);
        if (!result.success) {
          throw new Error(result.error || HERO_TOAST_MESSAGES.CONVERSION_FAILED);
        }
        // Update local state based on which variant we converted to
        if (convertBothTo === HERO_IMAGE_VARIANTS.DESKTOP) {
          updatedExistingDesktop = result.data!;
        } else {
          updatedExistingMobile = result.data!;
        }
        updatedExistingBoth = null;
      }

      // Execute pending deletions
      if (deleteDesktop && updatedExistingDesktop) {
        await deleteHero(HERO_IMAGE_VARIANTS.DESKTOP);
        updatedExistingDesktop = null;
      }
      if (deleteMobile && updatedExistingMobile) {
        await deleteHero(HERO_IMAGE_VARIANTS.MOBILE);
        updatedExistingMobile = null;
      }
      if (deleteBoth && updatedExistingBoth) {
        await deleteHero(HERO_IMAGE_VARIANTS.BOTH);
        updatedExistingBoth = null;
      }

      // Auto-detect mode considering existing images after conversion
      const hasDesktopUpload = desktop !== null;
      const hasMobileUpload = mobile !== null;
      const hasExistingDesktopAfter = updatedExistingDesktop !== null;
      const hasExistingMobileAfter = updatedExistingMobile !== null;

      // Use "both" mode only if uploading single file AND no existing separate variant
      const useBothMode =
        (hasDesktopUpload && !hasMobileUpload && !hasExistingMobileAfter) ||
        (hasMobileUpload && !hasDesktopUpload && !hasExistingDesktopAfter);

      const newImages = {
        desktop: updatedExistingDesktop,
        mobile: updatedExistingMobile,
        both: updatedExistingBoth,
      };

      if (useBothMode) {
        // Upload "both" variant (use whichever is selected)
        const file = desktop || mobile;
        if (file) {
          const formData = new FormData();
          formData.append(HERO_FORM_KEYS.FILE, file.file);
          formData.append(HERO_FORM_KEYS.VARIANT, HERO_IMAGE_VARIANTS.BOTH);
          const result = await uploadHero(formData);
          if (!result.success) {
            throw new Error(result.error || HERO_TOAST_MESSAGES.UPLOAD_FAILED);
          }
          newImages.both = result.data!;
        }

        // Delete desktop and mobile if they exist
        if (updatedExistingDesktop) {
          await deleteHero(HERO_IMAGE_VARIANTS.DESKTOP);
          newImages.desktop = null;
        }
        if (updatedExistingMobile) {
          await deleteHero(HERO_IMAGE_VARIANTS.MOBILE);
          newImages.mobile = null;
        }
      } else if (hasDesktopUpload || hasMobileUpload) {
        // Upload separate variants
        if (hasDesktopUpload) {
          const formDataDesktop = new FormData();
          formDataDesktop.append(HERO_FORM_KEYS.FILE, desktop!.file);
          formDataDesktop.append(HERO_FORM_KEYS.VARIANT, HERO_IMAGE_VARIANTS.DESKTOP);
          const resultDesktop = await uploadHero(formDataDesktop);
          if (!resultDesktop.success) {
            throw new Error(resultDesktop.error || HERO_TOAST_MESSAGES.DESKTOP_UPLOAD_FAILED);
          }
          newImages.desktop = resultDesktop.data!;
        }

        if (hasMobileUpload) {
          const formDataMobile = new FormData();
          formDataMobile.append(HERO_FORM_KEYS.FILE, mobile!.file);
          formDataMobile.append(HERO_FORM_KEYS.VARIANT, HERO_IMAGE_VARIANTS.MOBILE);
          const resultMobile = await uploadHero(formDataMobile);
          if (!resultMobile.success) {
            throw new Error(resultMobile.error || HERO_TOAST_MESSAGES.MOBILE_UPLOAD_FAILED);
          }
          newImages.mobile = resultMobile.data!;
        }

        // Delete "both" if it exists
        if (updatedExistingBoth) {
          await deleteHero(HERO_IMAGE_VARIANTS.BOTH);
          newImages.both = null;
        }
      }

      // Update state with new images and reset
      actions.setExistingImages(newImages);
      actions.reset();

      toast.success(HERO_TOAST_MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : HERO_TOAST_MESSAGES.SAVE_FAILED);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    actions.reset();
  };

  const hasChanges =
    state.desktop !== null ||
    state.mobile !== null ||
    state.deleteDesktop ||
    state.deleteMobile ||
    state.deleteBoth ||
    state.convertBothTo !== null;

  return { handleSave, handleReset, hasChanges, isSaving };
}

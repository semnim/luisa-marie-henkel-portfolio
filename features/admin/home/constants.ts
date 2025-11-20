/**
 * Constants for home admin feature
 * Prevents magic strings/numbers per coding standards
 */

export const HERO_FORM_KEYS = {
  FILE: 'file',
  VARIANT: 'variant',
} as const;

export const HERO_IMAGE_VARIANTS = {
  BOTH: 'both',
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
} as const;

export const HERO_TOAST_MESSAGES = {
  SAVE_SUCCESS: 'Saved successfully!',
  SAVE_FAILED: 'Save failed',
  UPLOAD_FAILED: 'Upload failed',
  DESKTOP_UPLOAD_FAILED: 'Desktop upload failed',
  MOBILE_UPLOAD_FAILED: 'Mobile upload failed',
  CONVERSION_FAILED: 'Conversion failed',
} as const;

export type HeroImageVariant =
  (typeof HERO_IMAGE_VARIANTS)[keyof typeof HERO_IMAGE_VARIANTS];

export const FEATURED_SLOTS_COUNT = 4;

export const FEATURED_FORM_KEYS = {
  FILE: 'file',
  VARIANT: 'variant',
  POSITION: 'position',
} as const;

export const FEATURED_TOAST_MESSAGES = {
  SAVE_SUCCESS: 'Featured projects saved successfully!',
  SAVE_FAILED: 'Save failed',
  UPLOAD_FAILED_POSITION_0: 'Upload failed for position 0',
  UPLOAD_FAILED_POSITION_1: 'Upload failed for position 1',
  UPLOAD_FAILED_POSITION_2: 'Upload failed for position 2',
  UPLOAD_FAILED_POSITION_3: 'Upload failed for position 3',
  DELETE_FAILED: 'Failed to delete',
} as const;

export const FEATURED_IMAGE_TYPE = 'featured_project';

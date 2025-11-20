import type { MediaUploadState } from '@/features/admin/hooks/use-media-upload-state';

interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
}

function hasUploadStateChanges(state: MediaUploadState): boolean {
  return (
    state.desktop !== null ||
    state.mobile !== null ||
    state.deleteDesktop ||
    state.deleteMobile ||
    state.deleteBoth ||
    state.convertBothTo !== null
  );
}

export function hasFeaturedChanges(
  initialProjects: readonly (FeaturedProject | undefined)[],
  currentProjects: readonly (FeaturedProject | undefined)[],
  uploadStates: MediaUploadState[]
): boolean {
  // Check project selection changes
  const hasProjectChanges = currentProjects.some(
    (project, index) => project?.id !== initialProjects[index]?.id
  );

  if (hasProjectChanges) return true;

  // Check upload state changes
  return uploadStates.some(hasUploadStateChanges);
}

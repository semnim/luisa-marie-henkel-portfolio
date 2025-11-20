'use client';

import type {
  MediaUploadActions,
  MediaUploadState,
} from '@/features/admin/hooks';
import { useMediaPreview } from '@/features/admin/hooks';
import type { FeaturedProject, PreviewMode } from '../../types';
import { FeaturedSlot } from '../featured-slot';

interface FeaturedSlotWrapperProps {
  index: number;
  project: FeaturedProject | undefined;
  state: MediaUploadState;
  actions: MediaUploadActions;
  previewMode: PreviewMode;
  onSelect: () => void;
  onRemove: () => void;
  isMobileSlideshow?: boolean;
}

export function FeaturedSlotWrapper({
  project,
  state,
  actions,
  previewMode,
  onSelect,
  onRemove,
  isMobileSlideshow = false,
}: FeaturedSlotWrapperProps) {
  const { currentMedia, isRemovable } = useMediaPreview(
    state,
    project?.thumbnailUrl,
    previewMode
  );

  return (
    <FeaturedSlot
      project={project}
      previewMode={previewMode}
      currentMedia={currentMedia}
      isRemovable={isRemovable}
      actions={actions}
      onSelect={onSelect}
      onProjectRemove={onRemove}
      isMobileSlideshow={isMobileSlideshow}
    />
  );
}

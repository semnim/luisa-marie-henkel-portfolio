'use client';

import type { FeaturedProject, PreviewMode } from '../../types';
import type { MediaUploadActions, MediaUploadState } from '@/features/admin/hooks';
import { useMediaPreview } from '@/features/admin/hooks';
import { FeaturedSlot } from '../featured-slot';

interface FeaturedSlotWrapperProps {
  index: number;
  project: FeaturedProject | undefined;
  state: MediaUploadState;
  actions: MediaUploadActions;
  previewMode: PreviewMode;
  onSelect: () => void;
  onRemove: () => void;
}

export function FeaturedSlotWrapper({
  project,
  state,
  actions,
  previewMode,
  onSelect,
  onRemove,
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
    />
  );
}

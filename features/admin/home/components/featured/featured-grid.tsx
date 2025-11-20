'use client';

import type { FeaturedProject, PreviewMode } from '../../types';
import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks';
import { FeaturedSlotWrapper } from './featured-slot-wrapper';

interface FeaturedGridProps {
  projects: readonly [
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined
  ];
  states: readonly [MediaUploadState, MediaUploadState, MediaUploadState, MediaUploadState];
  actions: readonly [MediaUploadActions, MediaUploadActions, MediaUploadActions, MediaUploadActions];
  previewMode: PreviewMode;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
}

export function FeaturedGrid({
  projects,
  states,
  actions,
  previewMode,
  onSelect,
  onRemove,
}: FeaturedGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((index) => (
        <FeaturedSlotWrapper
          key={index}
          index={index}
          project={projects[index]}
          state={states[index]}
          actions={actions[index]}
          previewMode={previewMode}
          onSelect={() => onSelect(index)}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}

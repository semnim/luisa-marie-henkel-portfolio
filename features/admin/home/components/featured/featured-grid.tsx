'use client';

import type {
  MediaUploadActions,
  MediaUploadState,
} from '@/features/admin/hooks';
import type { FeaturedProject, PreviewMode } from '../../types';
import { FeaturedMobileSlideshow } from './featured-mobile-slideshow';
import { FeaturedSlotWrapper } from './featured-slot-wrapper';

interface FeaturedGridProps {
  projects: readonly [
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined,
    FeaturedProject | undefined
  ];
  states: readonly [
    MediaUploadState,
    MediaUploadState,
    MediaUploadState,
    MediaUploadState
  ];
  actions: readonly [
    MediaUploadActions,
    MediaUploadActions,
    MediaUploadActions,
    MediaUploadActions
  ];
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
    <>
      {/* Mobile slideshow - visible on small viewports */}
      <div className="h-full md:hidden">
        <FeaturedMobileSlideshow
          projects={projects}
          states={states}
          actions={actions}
          previewMode={previewMode}
          onSelect={onSelect}
          onRemove={onRemove}
        />
      </div>

      {/* Desktop grid - visible on medium+ viewports */}
      <div className="hidden md:grid grid-cols-4 gap-4">
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
    </>
  );
}

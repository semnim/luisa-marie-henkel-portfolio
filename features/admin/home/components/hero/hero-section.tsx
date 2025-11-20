'use client';

import { useHeroState, useHeroHandlers } from '../../hooks';
import { useMediaPreview } from '@/features/admin/hooks/use-media-preview';
import { HeroUploadBox } from './hero-upload-box';
import { HeroToolbar } from './hero-toolbar';
import type { PreviewMode } from '../../types';
import type { Image } from '@/lib/schema';

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

interface HeroImages {
  desktop?: Image;
  mobile?: Image;
  both?: Image;
}

interface HeroSectionProps {
  heroResult: ActionResult<HeroImages> | undefined;
  previewMode: PreviewMode;
}

export function HeroSection({ heroResult, previewMode }: HeroSectionProps) {
  const { state, actions } = useHeroState(heroResult);
  const { handleSave, handleReset, hasChanges, isSaving } = useHeroHandlers(
    state,
    actions
  );
  const preview = useMediaPreview(
    state,
    '/assets/home_hero.webp',
    previewMode
  );

  return (
    <section className="space-y-6">
      <h2 className="text-xs font-light text-muted-foreground uppercase tracking-item-subheading">
        HERO
      </h2>

      <HeroUploadBox
        aspectRatio={previewMode === 'desktop' ? '16/9' : '9/16'}
        currentMedia={preview.currentMedia}
        isRemovable={preview.isRemovable}
        onFileSelect={
          previewMode === 'desktop' ? actions.setDesktop : actions.setMobile
        }
        onRemove={
          previewMode === 'desktop'
            ? actions.removeDesktop
            : actions.removeMobile
        }
      />

      {hasChanges && (
        <HeroToolbar
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
        />
      )}
    </section>
  );
}

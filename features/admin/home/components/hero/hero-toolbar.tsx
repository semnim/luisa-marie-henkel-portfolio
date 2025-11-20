'use client';

import { MediaToolbar } from '@/features/admin/portfolio/components/media-toolbar';

interface HeroToolbarProps {
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function HeroToolbar({
  isSaving,
  onSave,
  onReset,
}: HeroToolbarProps) {
  return (
    <MediaToolbar
      hasChanges={true}
      isSaving={isSaving}
      onSave={onSave}
      onReset={onReset}
    />
  );
}

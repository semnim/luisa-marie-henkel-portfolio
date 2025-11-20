'use client';

import { MediaToolbar } from '@/features/admin/portfolio/components/media-toolbar';

interface FeaturedToolbarProps {
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function FeaturedToolbar({
  isSaving,
  onSave,
  onReset,
}: FeaturedToolbarProps) {
  return (
    <MediaToolbar
      hasChanges={true}
      isSaving={isSaving}
      onSave={onSave}
      onReset={onReset}
    />
  );
}

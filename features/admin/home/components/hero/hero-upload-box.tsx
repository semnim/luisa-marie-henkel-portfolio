'use client';

import { MediaUploadBox } from '@/features/admin/portfolio/components/media-upload-box';
import type { MediaPreviewInfo } from '@/features/admin/hooks/use-media-preview';

interface HeroUploadBoxProps {
  aspectRatio: '16/9' | '9/16';
  currentMedia?: MediaPreviewInfo;
  isRemovable: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

export function HeroUploadBox({
  aspectRatio,
  currentMedia,
  isRemovable,
  onFileSelect,
  onRemove,
}: HeroUploadBoxProps) {
  return (
    <MediaUploadBox
      aspectRatio={aspectRatio}
      accept="both"
      currentMedia={currentMedia}
      onFileSelect={onFileSelect}
      onRemove={onRemove}
      isRemovable={isRemovable}
    />
  );
}

import { useEffect } from 'react';
import { useMediaUploadState } from '@/features/admin/hooks/use-media-upload-state';
import type { HeroStateReturn } from '../types';
import type { Image } from '@/lib/schema';

interface HeroImages {
  desktop?: Image;
  mobile?: Image;
  both?: Image;
}

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export function useHeroState(
  heroResult: ActionResult<HeroImages> | undefined
): HeroStateReturn {
  const [state, actions] = useMediaUploadState();

  // Sync DB data to state on load
  useEffect(() => {
    if (heroResult?.success && heroResult.data) {
      actions.setExistingImages({
        desktop: heroResult.data.desktop,
        mobile: heroResult.data.mobile,
        both: heroResult.data.both,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroResult]);

  return { state, actions };
}

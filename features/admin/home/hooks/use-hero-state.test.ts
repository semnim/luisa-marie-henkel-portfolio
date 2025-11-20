import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHeroState } from './use-hero-state';
import type { Image } from '@/lib/schema';

// Mock the useMediaUploadState hook
vi.mock('@/features/admin/hooks/use-media-upload-state', () => ({
  useMediaUploadState: vi.fn(),
}));

import { useMediaUploadState } from '@/features/admin/hooks/use-media-upload-state';

describe('useHeroState', () => {
  const mockImage: Image = {
    id: 1,
    type: 'hero',
    variant: 'desktop',
    url: 'https://example.com/image.jpg',
    width: 1920,
    height: 1080,
    format: 'jpg',
    size: 12345,
    uploadedAt: new Date('2024-01-01'),
  };

  const mockState = {
    desktop: null,
    mobile: null,
    existingDesktop: null,
    existingMobile: null,
    existingBoth: null,
    deleteDesktop: false,
    deleteMobile: false,
    deleteBoth: false,
    convertBothTo: null,
    previewMode: 'desktop' as const,
  };

  const mockActions = {
    setDesktop: vi.fn(),
    setMobile: vi.fn(),
    removeDesktop: vi.fn(),
    removeMobile: vi.fn(),
    setPreviewMode: vi.fn(),
    reset: vi.fn(),
    setExistingImages: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaUploadState).mockReturnValue([mockState, mockActions]);
  });

  it('returns state and actions from useMediaUploadState', () => {
    const { result } = renderHook(() => useHeroState(undefined));

    expect(result.current.state).toBe(mockState);
    expect(result.current.actions).toBe(mockActions);
  });

  it('syncs DB data to state when heroResult.success is true', () => {
    const heroResult = {
      success: true,
      data: {
        desktop: mockImage,
        mobile: { ...mockImage, id: 2, variant: 'mobile' as const },
        both: { ...mockImage, id: 3, variant: 'both' as const },
      },
    };

    renderHook(() => useHeroState(heroResult));

    expect(mockActions.setExistingImages).toHaveBeenCalledTimes(1);
    expect(mockActions.setExistingImages).toHaveBeenCalledWith({
      desktop: heroResult.data.desktop,
      mobile: heroResult.data.mobile,
      both: heroResult.data.both,
    });
  });

  it('handles heroResult.success = false gracefully', () => {
    const heroResult = {
      success: false,
      error: 'Failed to fetch hero data',
    };

    renderHook(() => useHeroState(heroResult));

    expect(mockActions.setExistingImages).not.toHaveBeenCalled();
  });

  it('handles undefined heroResult', () => {
    renderHook(() => useHeroState(undefined));

    expect(mockActions.setExistingImages).not.toHaveBeenCalled();
  });

  it('handles null heroResult', () => {
    renderHook(() => useHeroState(null));

    expect(mockActions.setExistingImages).not.toHaveBeenCalled();
  });

  it('calls setExistingImages with correct structure when some images are null', () => {
    const heroResult = {
      success: true,
      data: {
        desktop: mockImage,
        mobile: null,
        both: null,
      },
    };

    renderHook(() => useHeroState(heroResult));

    expect(mockActions.setExistingImages).toHaveBeenCalledWith({
      desktop: mockImage,
      mobile: null,
      both: null,
    });
  });

  it('re-syncs when heroResult changes', () => {
    const initialHeroResult = {
      success: true,
      data: {
        desktop: mockImage,
        mobile: null,
        both: null,
      },
    };

    const { rerender } = renderHook(
      ({ heroResult }) => useHeroState(heroResult),
      {
        initialProps: { heroResult: initialHeroResult },
      }
    );

    expect(mockActions.setExistingImages).toHaveBeenCalledTimes(1);

    const updatedHeroResult = {
      success: true,
      data: {
        desktop: null,
        mobile: { ...mockImage, id: 2, variant: 'mobile' as const },
        both: null,
      },
    };

    rerender({ heroResult: updatedHeroResult });

    expect(mockActions.setExistingImages).toHaveBeenCalledTimes(2);
    expect(mockActions.setExistingImages).toHaveBeenLastCalledWith({
      desktop: null,
      mobile: updatedHeroResult.data.mobile,
      both: null,
    });
  });
});

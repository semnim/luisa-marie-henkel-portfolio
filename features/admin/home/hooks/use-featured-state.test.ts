import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFeaturedState } from './use-featured-state';
import type { Image } from '@/lib/schema';
import type { FeaturedProject } from '../types';

// Mock the useMediaUploadState hook
vi.mock('@/features/admin/hooks/use-media-upload-state', () => ({
  useMediaUploadState: vi.fn(),
}));

import { useMediaUploadState } from '@/features/admin/hooks/use-media-upload-state';

describe('useFeaturedState', () => {
  const mockImage: Image = {
    id: 1,
    type: 'featured',
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
    // Mock returns 4 different instances for 4 slots - each hook call needs this
    vi.mocked(useMediaUploadState).mockReturnValue([
      { ...mockState },
      { ...mockActions },
    ]);
  });

  it('returns FeaturedStateReturn type with all required properties', () => {
    const { result } = renderHook(() => useFeaturedState(undefined));

    expect(result.current).toHaveProperty('projects');
    expect(result.current).toHaveProperty('setProjects');
    expect(result.current).toHaveProperty('initialProjects');
    expect(result.current).toHaveProperty('states');
    expect(result.current).toHaveProperty('actions');
    expect(result.current).toHaveProperty('loadProjects');
  });

  it('initializes 4 upload states', () => {
    const { result } = renderHook(() => useFeaturedState(undefined));

    expect(result.current.states).toHaveLength(4);
    expect(result.current.actions).toHaveLength(4);
    expect(useMediaUploadState).toHaveBeenCalledTimes(4);
  });

  it('initializes projects as empty FeaturedSlots tuple', () => {
    const { result } = renderHook(() => useFeaturedState(undefined));

    expect(result.current.projects).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(result.current.initialProjects).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('loads projects from featuredResult correctly', async () => {
    const project1: FeaturedProject = {
      id: 'project-1',
      title: 'Project 1',
      slug: 'project-1',
    };
    const project2: FeaturedProject = {
      id: 'project-2',
      title: 'Project 2',
      slug: 'project-2',
    };

    const featuredResult = {
      success: true,
      data: [
        {
          position: 0,
          projectSlug: project1.slug,
          projectTitle: project1.title,
          images: {
            desktop: mockImage,
            mobile: null,
            both: null,
          },
        },
        {
          position: 2,
          projectSlug: project2.slug,
          projectTitle: project2.title,
          images: {
            desktop: null,
            mobile: { ...mockImage, id: 2 },
            both: null,
          },
        },
      ],
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      expect(result.current.projects[0]).toEqual({
        id: project1.slug,
        slug: project1.slug,
        title: project1.title,
      });
      expect(result.current.projects[1]).toBeUndefined();
      expect(result.current.projects[2]).toEqual({
        id: project2.slug,
        slug: project2.slug,
        title: project2.title,
      });
      expect(result.current.projects[3]).toBeUndefined();
    });
  });

  it('calls setExistingImages for each project position', async () => {
    const featuredResult = {
      success: true,
      data: [
        {
          position: 0,
          projectSlug: 'project-1',
          projectTitle: 'Project 1',
          images: {
            desktop: mockImage,
            mobile: null,
            both: null,
          },
        },
        {
          position: 2,
          projectSlug: 'project-2',
          projectTitle: 'Project 2',
          images: {
            desktop: null,
            mobile: { ...mockImage, id: 2 },
            both: { ...mockImage, id: 3 },
          },
        },
      ],
    };

    renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      // First call for slot 0
      expect(mockActions.setExistingImages).toHaveBeenCalledWith({
        desktop: mockImage,
        mobile: null,
        both: null,
      });
      // Second call for slot 2
      expect(mockActions.setExistingImages).toHaveBeenCalledWith({
        desktop: null,
        mobile: { ...mockImage, id: 2 },
        both: { ...mockImage, id: 3 },
      });
    });
  });

  it('handles missing/undefined projects in featuredResult', async () => {
    const featuredResult = {
      success: true,
      data: [],
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      expect(result.current.projects).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });
  });

  it('handles featuredResult.success = false', async () => {
    const featuredResult = {
      success: false,
      error: 'Failed to fetch featured projects',
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      expect(result.current.projects).toEqual([
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
      expect(mockActions.setExistingImages).not.toHaveBeenCalled();
    });
  });

  it('handles undefined featuredResult', () => {
    const { result } = renderHook(() => useFeaturedState(undefined));

    expect(result.current.projects).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(mockActions.setExistingImages).not.toHaveBeenCalled();
  });

  it('handles null featuredResult', () => {
    const { result } = renderHook(() => useFeaturedState(null));

    expect(result.current.projects).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
    expect(mockActions.setExistingImages).not.toHaveBeenCalled();
  });

  it('updates projects via setProjects', () => {
    const { result } = renderHook(() => useFeaturedState(undefined));

    const newProjects: [
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined,
      FeaturedProject | undefined
    ] = [
      { id: 'p1', title: 'Project 1', slug: 'p1' },
      undefined,
      { id: 'p2', title: 'Project 2', slug: 'p2' },
      undefined,
    ];

    act(() => {
      result.current.setProjects(newProjects);
    });

    expect(result.current.projects).toEqual(newProjects);
  });

  it('syncs initialProjects when loadProjects is called', async () => {
    const project: FeaturedProject = {
      id: 'project-1',
      title: 'Project 1',
      slug: 'project-1',
    };

    const featuredResult = {
      success: true,
      data: [
        {
          position: 0,
          projectSlug: project.slug,
          projectTitle: project.title,
          images: {
            desktop: mockImage,
            mobile: null,
            both: null,
          },
        },
      ],
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      expect(result.current.initialProjects[0]).toEqual({
        id: project.slug,
        slug: project.slug,
        title: project.title,
      });
    });
  });

  it('re-loads projects when featuredResult changes', async () => {
    const initialFeaturedResult = {
      success: true,
      data: [
        {
          position: 0,
          projectSlug: 'project-1',
          projectTitle: 'Project 1',
          images: {
            desktop: mockImage,
            mobile: null,
            both: null,
          },
        },
      ],
    };

    const { result, rerender } = renderHook(
      ({ featuredResult }) => useFeaturedState(featuredResult),
      {
        initialProps: { featuredResult: initialFeaturedResult },
      }
    );

    await waitFor(() => {
      expect(result.current.projects[0]?.slug).toBe('project-1');
    });

    const updatedFeaturedResult = {
      success: true,
      data: [
        {
          position: 1,
          projectSlug: 'project-2',
          projectTitle: 'Project 2',
          images: {
            desktop: null,
            mobile: { ...mockImage, id: 2 },
            both: null,
          },
        },
      ],
    };

    rerender({ featuredResult: updatedFeaturedResult });

    await waitFor(() => {
      expect(result.current.projects[0]).toBeUndefined();
      expect(result.current.projects[1]?.slug).toBe('project-2');
    });
  });

  it('ignores out-of-bounds positions', async () => {
    const featuredResult = {
      success: true,
      data: [
        {
          position: -1,
          projectSlug: 'invalid-1',
          projectTitle: 'Invalid 1',
          images: { desktop: null, mobile: null, both: null },
        },
        {
          position: 4,
          projectSlug: 'invalid-2',
          projectTitle: 'Invalid 2',
          images: { desktop: null, mobile: null, both: null },
        },
        {
          position: 0,
          projectSlug: 'valid',
          projectTitle: 'Valid',
          images: { desktop: mockImage, mobile: null, both: null },
        },
      ],
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    await waitFor(() => {
      expect(result.current.projects[0]?.slug).toBe('valid');
      expect(result.current.projects[1]).toBeUndefined();
      expect(result.current.projects[2]).toBeUndefined();
      expect(result.current.projects[3]).toBeUndefined();
    });
  });

  it('loadProjects can be called manually to re-sync from DB', async () => {
    const project: FeaturedProject = {
      id: 'project-1',
      title: 'Project 1',
      slug: 'project-1',
    };

    const featuredResult = {
      success: true,
      data: [
        {
          position: 0,
          projectSlug: project.slug,
          projectTitle: project.title,
          images: {
            desktop: mockImage,
            mobile: null,
            both: null,
          },
        },
      ],
    };

    const { result } = renderHook(() => useFeaturedState(featuredResult));

    // Manually modify projects
    act(() => {
      result.current.setProjects([
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });

    expect(result.current.projects[0]).toBeUndefined();

    // Call loadProjects to re-sync
    await act(async () => {
      await result.current.loadProjects();
    });

    expect(result.current.projects[0]).toEqual({
      id: project.slug,
      slug: project.slug,
      title: project.title,
    });
  });
});

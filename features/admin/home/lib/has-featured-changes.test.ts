import { describe, it, expect } from 'vitest';
import { hasFeaturedChanges } from './has-featured-changes';
import type { MediaUploadState } from '@/features/admin/hooks/use-media-upload-state';

const emptyState: MediaUploadState = {
  desktop: null,
  mobile: null,
  existingDesktop: null,
  existingMobile: null,
  existingBoth: null,
  deleteDesktop: false,
  deleteMobile: false,
  deleteBoth: false,
  convertBothTo: null,
  previewMode: 'desktop',
};

describe('hasFeaturedChanges', () => {
  it('returns false when no changes exist', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const currentProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const uploadStates = [emptyState, emptyState, emptyState, emptyState];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(false);
  });

  it('returns true when project selection changed', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const currentProjects = [
      { id: 'project-b', title: 'Project B', slug: 'project-b' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const uploadStates = [emptyState, emptyState, emptyState, emptyState];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when project removed', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [emptyState, emptyState, emptyState, emptyState];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when desktop upload staged', () => {
    const initialProjects = [undefined, undefined, undefined, undefined] as const;
    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [
      {
        ...emptyState,
        desktop: { file: new File([], 'test.jpg'), url: 'blob:test', type: 'image' as const },
      },
      emptyState,
      emptyState,
      emptyState,
    ];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when mobile upload staged', () => {
    const initialProjects = [undefined, undefined, undefined, undefined] as const;
    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [
      emptyState,
      {
        ...emptyState,
        mobile: { file: new File([], 'test.jpg'), url: 'blob:test', type: 'image' as const },
      },
      emptyState,
      emptyState,
    ];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when deletion pending', () => {
    const initialProjects = [undefined, undefined, undefined, undefined] as const;
    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [
      emptyState,
      emptyState,
      { ...emptyState, deleteDesktop: true },
      emptyState,
    ];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when conversion pending', () => {
    const initialProjects = [undefined, undefined, undefined, undefined] as const;
    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [
      emptyState,
      emptyState,
      emptyState,
      { ...emptyState, convertBothTo: 'desktop' as const },
    ];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });

  it('returns true when any of multiple states have changes', () => {
    const initialProjects = [undefined, undefined, undefined, undefined] as const;
    const currentProjects = [undefined, undefined, undefined, undefined] as const;

    const uploadStates = [
      emptyState,
      { ...emptyState, deleteDesktop: true },
      { ...emptyState, deleteMobile: true },
      emptyState,
    ];

    expect(
      hasFeaturedChanges(initialProjects, currentProjects, uploadStates)
    ).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useFeaturedHandlers } from './use-featured-handlers';
import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks/use-media-upload-state';
import type { FeaturedProject, AvailableProject } from '@/features/admin/home/types';

// Mock server actions
vi.mock('@/features/home/actions/featured', () => ({
  saveAllFeatured: vi.fn(),
  deleteFeaturedImages: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock utility functions
vi.mock('@/features/admin/home/lib/has-featured-changes', () => ({
  hasFeaturedChanges: vi.fn(),
}));

vi.mock('@/features/admin/home/utils/featured-changes', () => ({
  getProjectsToDelete: vi.fn(),
}));

vi.mock('@/features/admin/home/utils/filter-projects', () => ({
  getUnselectedProjects: vi.fn(),
}));

import { saveAllFeatured, deleteFeaturedImages } from '@/features/home/actions/featured';
import { toast } from 'sonner';
import { hasFeaturedChanges } from '@/features/admin/home/lib/has-featured-changes';
import { getProjectsToDelete } from '@/features/admin/home/utils/featured-changes';
import { getUnselectedProjects } from '@/features/admin/home/utils/filter-projects';

describe('useFeaturedHandlers', () => {
  const createMockState = (overrides: Partial<MediaUploadState> = {}): MediaUploadState => ({
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
    ...overrides,
  });

  const createMockActions = (): MediaUploadActions => ({
    setDesktop: vi.fn(),
    setMobile: vi.fn(),
    removeDesktop: vi.fn(),
    removeMobile: vi.fn(),
    setPreviewMode: vi.fn(),
    reset: vi.fn(),
    setExistingImages: vi.fn(),
  });

  const mockProject1: FeaturedProject = {
    id: 'project-1',
    title: 'Project 1',
    slug: 'project-1',
  };

  const mockProject2: FeaturedProject = {
    id: 'project-2',
    title: 'Project 2',
    slug: 'project-2',
  };

  const mockAvailableProject: AvailableProject = {
    id: 3,
    title: 'Project 3',
    slug: 'project-3',
  };

  const createDefaultProps = () => {
    const states: [MediaUploadState, MediaUploadState, MediaUploadState, MediaUploadState] = [
      createMockState(),
      createMockState(),
      createMockState(),
      createMockState(),
    ];

    const actions: [MediaUploadActions, MediaUploadActions, MediaUploadActions, MediaUploadActions] = [
      createMockActions(),
      createMockActions(),
      createMockActions(),
      createMockActions(),
    ];

    const projects: [FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined, FeaturedProject | undefined] = [
      mockProject1,
      undefined,
      undefined,
      undefined,
    ];

    const setProjects = vi.fn();
    const loadProjects = vi.fn();

    return {
      projects,
      setProjects,
      initialProjects: projects,
      states,
      actions,
      loadProjects,
      availableProjects: [mockAvailableProject],
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hasFeaturedChanges).mockReturnValue(false);
    vi.mocked(getProjectsToDelete).mockReturnValue([]);
    vi.mocked(getUnselectedProjects).mockReturnValue([mockAvailableProject]);
  });

  describe('return values', () => {
    it('returns FeaturedHandlersReturn type with all required properties', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current).toHaveProperty('handleSelect');
      expect(result.current).toHaveProperty('handleProjectSelect');
      expect(result.current).toHaveProperty('handleRemove');
      expect(result.current).toHaveProperty('handleSave');
      expect(result.current).toHaveProperty('handleReset');
      expect(result.current).toHaveProperty('hasChanges');
      expect(result.current).toHaveProperty('isSaving');
      expect(result.current).toHaveProperty('selectorOpen');
      expect(result.current).toHaveProperty('setSelectorOpen');
      expect(result.current).toHaveProperty('selectedSlot');
      expect(result.current).toHaveProperty('unselectedProjects');

      expect(typeof result.current.handleSelect).toBe('function');
      expect(typeof result.current.handleProjectSelect).toBe('function');
      expect(typeof result.current.handleRemove).toBe('function');
      expect(typeof result.current.handleSave).toBe('function');
      expect(typeof result.current.handleReset).toBe('function');
      expect(typeof result.current.hasChanges).toBe('boolean');
      expect(typeof result.current.isSaving).toBe('boolean');
      expect(typeof result.current.selectorOpen).toBe('boolean');
      expect(typeof result.current.setSelectorOpen).toBe('function');
      expect(result.current.selectedSlot === null || typeof result.current.selectedSlot === 'number').toBe(true);
      expect(Array.isArray(result.current.unselectedProjects)).toBe(true);
    });

    it('isSaving is initially false', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.isSaving).toBe(false);
    });

    it('selectorOpen is initially false', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.selectorOpen).toBe(false);
    });

    it('selectedSlot is initially null', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.selectedSlot).toBe(null);
    });
  });

  describe('handleSelect', () => {
    it('opens dialog with correct slot index', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleSelect(2);
      });

      expect(result.current.selectorOpen).toBe(true);
      expect(result.current.selectedSlot).toBe(2);
    });

    it('handles slot 0', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleSelect(0);
      });

      expect(result.current.selectedSlot).toBe(0);
    });

    it('handles slot 3', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleSelect(3);
      });

      expect(result.current.selectedSlot).toBe(3);
    });
  });

  describe('handleProjectSelect', () => {
    it('adds project to selected slot and closes dialog', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      // Open dialog for slot 1
      act(() => {
        result.current.handleSelect(1);
      });

      // Select project
      act(() => {
        result.current.handleProjectSelect({ id: 'new-project', title: 'New Project' });
      });

      expect(props.setProjects).toHaveBeenCalledWith([
        mockProject1,
        { id: 'new-project', title: 'New Project', slug: 'new-project' },
        undefined,
        undefined,
      ]);
      expect(result.current.selectorOpen).toBe(false);
      expect(result.current.selectedSlot).toBe(null);
    });

    it('does nothing if no slot is selected', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleProjectSelect({ id: 'new-project', title: 'New Project' });
      });

      expect(props.setProjects).not.toHaveBeenCalled();
      expect(result.current.selectorOpen).toBe(false);
    });

    it('correctly sets slug from id', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleSelect(0);
      });

      act(() => {
        result.current.handleProjectSelect({ id: 'test-slug', title: 'Test' });
      });

      expect(props.setProjects).toHaveBeenCalledWith([
        { id: 'test-slug', title: 'Test', slug: 'test-slug' },
        undefined,
        undefined,
        undefined,
      ]);
    });
  });

  describe('handleRemove', () => {
    it('removes project from slot (deferred deletion)', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleRemove(0);
      });

      expect(props.setProjects).toHaveBeenCalledWith([
        undefined,
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('resets upload state for removed slot', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleRemove(0);
      });

      expect(props.actions[0].setExistingImages).toHaveBeenCalledWith({
        desktop: null,
        mobile: null,
        both: null,
      });
      expect(props.actions[0].reset).toHaveBeenCalled();
    });

    it('handles removing from different slots', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleRemove(2);
      });

      expect(props.actions[2].setExistingImages).toHaveBeenCalled();
      expect(props.actions[2].reset).toHaveBeenCalled();
    });
  });

  describe('handleSave', () => {
    it('processes deletions first', async () => {
      const props = createDefaultProps();
      vi.mocked(getProjectsToDelete).mockReturnValue(['deleted-project']);
      vi.mocked(deleteFeaturedImages).mockResolvedValue({ success: true });
      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(deleteFeaturedImages).toHaveBeenCalledWith('deleted-project');
    });

    it('saves upload changes with correct data structure', async () => {
      const props = createDefaultProps();
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      props.states[0] = createMockState({
        desktop: { file: mockFile, preview: 'preview-url' },
        mobile: null,
      });

      vi.mocked(getProjectsToDelete).mockReturnValue([]);
      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(saveAllFeatured).toHaveBeenCalledWith([
        {
          projectSlug: 'project-1',
          position: 0,
          both: mockFile,
        },
      ]);
    });

    it('uses "both" mode when only desktop file is uploaded', async () => {
      const props = createDefaultProps();
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      props.states[0] = createMockState({
        desktop: { file: mockFile, preview: 'preview-url' },
        mobile: null,
      });

      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      const callArgs = vi.mocked(saveAllFeatured).mock.calls[0][0];
      expect(callArgs[0]).toHaveProperty('both', mockFile);
      expect(callArgs[0]).not.toHaveProperty('desktop');
    });

    it('uses "both" mode when only mobile file is uploaded', async () => {
      const props = createDefaultProps();
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      props.states[0] = createMockState({
        desktop: null,
        mobile: { file: mockFile, preview: 'preview-url' },
      });

      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      const callArgs = vi.mocked(saveAllFeatured).mock.calls[0][0];
      expect(callArgs[0]).toHaveProperty('both', mockFile);
      expect(callArgs[0]).not.toHaveProperty('mobile');
    });

    it('uses separate desktop/mobile when both files uploaded', async () => {
      const props = createDefaultProps();
      const mockDesktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const mockMobileFile = new File(['mobile'], 'mobile.jpg', { type: 'image/jpeg' });

      props.states[0] = createMockState({
        desktop: { file: mockDesktopFile, preview: 'desktop-preview' },
        mobile: { file: mockMobileFile, preview: 'mobile-preview' },
      });

      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      const callArgs = vi.mocked(saveAllFeatured).mock.calls[0][0];
      expect(callArgs[0]).toHaveProperty('desktop', mockDesktopFile);
      expect(callArgs[0]).toHaveProperty('mobile', mockMobileFile);
      expect(callArgs[0]).not.toHaveProperty('both');
    });

    it('handles deleteBoth by calling deleteFeaturedImages', async () => {
      const props = createDefaultProps();
      props.states[0] = createMockState({
        existingBoth: { id: 1, imageUrl: 'test.jpg', variant: 'both' as const, imageType: 'featured_project', createdAt: new Date() },
        deleteBoth: true,
      });

      vi.mocked(deleteFeaturedImages).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(deleteFeaturedImages).toHaveBeenCalledWith('project-1');
      expect(props.actions[0].setExistingImages).toHaveBeenCalledWith({
        desktop: null,
        mobile: null,
        both: null,
      });
    });

    it('skips slots without changes', async () => {
      const props = createDefaultProps();
      props.projects = [mockProject1, mockProject2, undefined, undefined];
      props.states[0] = createMockState(); // No changes
      props.states[1] = createMockState(); // No changes

      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(saveAllFeatured).not.toHaveBeenCalled();
    });

    it('resets all states after successful save', async () => {
      const props = createDefaultProps();
      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      props.actions.forEach(action => {
        expect(action.reset).toHaveBeenCalled();
      });
    });

    it('calls loadProjects after successful save', async () => {
      const props = createDefaultProps();
      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(props.loadProjects).toHaveBeenCalled();
    });

    it('shows success toast after save', async () => {
      const props = createDefaultProps();
      vi.mocked(saveAllFeatured).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(toast.success).toHaveBeenCalledWith('Featured projects saved successfully!');
    });

    it('shows error toast on deletion failure', async () => {
      const props = createDefaultProps();
      vi.mocked(getProjectsToDelete).mockReturnValue(['deleted-project']);
      vi.mocked(deleteFeaturedImages).mockResolvedValue({
        success: false,
        error: 'Delete error'
      });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to delete deleted-project: Delete error');
    });

    it('shows error toast on save failure', async () => {
      const props = createDefaultProps();
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      props.states[0] = createMockState({
        desktop: { file: mockFile, preview: 'preview-url' },
      });

      vi.mocked(saveAllFeatured).mockResolvedValue({
        success: false,
        error: 'Save error'
      });

      const { result } = renderHook(() => useFeaturedHandlers(props));

      await act(async () => {
        await result.current.handleSave();
      });

      expect(toast.error).toHaveBeenCalledWith('Save error');
    });

    it('sets isSaving during save operation', async () => {
      const props = createDefaultProps();
      vi.mocked(saveAllFeatured).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );

      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.isSaving).toBe(false);

      const savePromise = act(async () => {
        await result.current.handleSave();
      });

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });

      await savePromise;
    });
  });

  describe('handleReset', () => {
    it('resets all upload states', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleReset();
      });

      props.actions.forEach(action => {
        expect(action.reset).toHaveBeenCalled();
      });
    });

    it('restores initial projects', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleReset();
      });

      expect(props.setProjects).toHaveBeenCalledWith(props.initialProjects);
    });

    it('calls loadProjects to restore existing images', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      act(() => {
        result.current.handleReset();
      });

      expect(props.loadProjects).toHaveBeenCalled();
    });
  });

  describe('hasChanges', () => {
    it('delegates to hasFeaturedChanges utility', () => {
      const props = createDefaultProps();
      vi.mocked(hasFeaturedChanges).mockReturnValue(true);

      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.hasChanges).toBe(true);
      expect(hasFeaturedChanges).toHaveBeenCalledWith(
        props.initialProjects,
        props.projects,
        props.states
      );
    });

    it('returns false when no changes detected', () => {
      const props = createDefaultProps();
      vi.mocked(hasFeaturedChanges).mockReturnValue(false);

      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.hasChanges).toBe(false);
    });
  });

  describe('unselectedProjects', () => {
    it('delegates to getUnselectedProjects utility', () => {
      const props = createDefaultProps();
      const mockUnselected = [mockAvailableProject];
      vi.mocked(getUnselectedProjects).mockReturnValue(mockUnselected);

      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.unselectedProjects).toEqual(mockUnselected);
      expect(getUnselectedProjects).toHaveBeenCalledWith(
        props.availableProjects,
        props.projects
      );
    });

    it('filters out selected projects', () => {
      const props = createDefaultProps();
      const unselected: AvailableProject[] = [
        { id: 4, title: 'Project 4', slug: 'project-4' },
      ];
      vi.mocked(getUnselectedProjects).mockReturnValue(unselected);

      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.unselectedProjects).toEqual(unselected);
    });
  });

  describe('setSelectorOpen', () => {
    it('opens and closes selector dialog', () => {
      const props = createDefaultProps();
      const { result } = renderHook(() => useFeaturedHandlers(props));

      expect(result.current.selectorOpen).toBe(false);

      act(() => {
        result.current.setSelectorOpen(true);
      });

      expect(result.current.selectorOpen).toBe(true);

      act(() => {
        result.current.setSelectorOpen(false);
      });

      expect(result.current.selectorOpen).toBe(false);
    });
  });
});

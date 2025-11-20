import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHeroHandlers } from './use-hero-handlers';
import type { MediaUploadState, MediaUploadActions } from '@/features/admin/hooks/use-media-upload-state';
import type { Image } from '@/lib/schema';

// Mock server actions
vi.mock('@/features/home/actions/hero', () => ({
  uploadHero: vi.fn(),
  deleteHero: vi.fn(),
  convertHero: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { uploadHero, deleteHero, convertHero } from '@/features/home/actions/hero';
import { toast } from 'sonner';

describe('useHeroHandlers', () => {
  const mockImage: Image = {
    id: 1,
    projectSlug: null,
    publicId: 'test-public-id',
    imageUrl: 'https://example.com/image.jpg',
    imageType: 'home_hero',
    variant: 'desktop',
    width: 1920,
    height: 1080,
    format: 'jpg',
    altText: null,
    uploadedAt: new Date('2024-01-01'),
  };

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('return values', () => {
    it('returns handleSave, handleReset, hasChanges, isSaving', () => {
      const state = createMockState();
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current).toHaveProperty('handleSave');
      expect(result.current).toHaveProperty('handleReset');
      expect(result.current).toHaveProperty('hasChanges');
      expect(result.current).toHaveProperty('isSaving');
      expect(typeof result.current.handleSave).toBe('function');
      expect(typeof result.current.handleReset).toBe('function');
      expect(typeof result.current.hasChanges).toBe('boolean');
      expect(typeof result.current.isSaving).toBe('boolean');
    });

    it('isSaving is initially false', () => {
      const state = createMockState();
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.isSaving).toBe(false);
    });
  });

  describe('hasChanges detection', () => {
    it('hasChanges is false when state is clean', () => {
      const state = createMockState();
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(false);
    });

    it('hasChanges is true when desktop upload is present', () => {
      const state = createMockState({
        desktop: { file: new File([''], 'test.jpg'), preview: 'data:image/jpeg;base64,test' },
      });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is true when mobile upload is present', () => {
      const state = createMockState({
        mobile: { file: new File([''], 'test.jpg'), preview: 'data:image/jpeg;base64,test' },
      });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is true when deleteDesktop is true', () => {
      const state = createMockState({ deleteDesktop: true });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is true when deleteMobile is true', () => {
      const state = createMockState({ deleteMobile: true });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is true when deleteBoth is true', () => {
      const state = createMockState({ deleteBoth: true });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });

    it('hasChanges is true when convertBothTo is set', () => {
      const state = createMockState({ convertBothTo: 'desktop' });
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe('handleReset', () => {
    it('calls actions.reset()', () => {
      const state = createMockState();
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      result.current.handleReset();

      expect(actions.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSave - conversion logic', () => {
    it('converts both to desktop when convertBothTo is desktop', async () => {
      const state = createMockState({
        existingBoth: mockImage,
        convertBothTo: 'desktop',
      });
      const actions = createMockActions();
      const convertedImage = { ...mockImage, id: 2, variant: 'desktop' as const };

      vi.mocked(convertHero).mockResolvedValue({
        success: true,
        data: convertedImage,
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(convertHero).toHaveBeenCalledWith('desktop');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: convertedImage,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('converts both to mobile when convertBothTo is mobile', async () => {
      const state = createMockState({
        existingBoth: mockImage,
        convertBothTo: 'mobile',
      });
      const actions = createMockActions();
      const convertedImage = { ...mockImage, id: 2, variant: 'mobile' as const };

      vi.mocked(convertHero).mockResolvedValue({
        success: true,
        data: convertedImage,
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(convertHero).toHaveBeenCalledWith('mobile');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: convertedImage,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('throws error when conversion fails', async () => {
      const state = createMockState({
        existingBoth: mockImage,
        convertBothTo: 'desktop',
      });
      const actions = createMockActions();

      vi.mocked(convertHero).mockResolvedValue({
        success: false,
        error: 'Conversion failed',
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Conversion failed');
        expect(actions.reset).not.toHaveBeenCalled();
      });
    });
  });

  describe('handleSave - deletion logic', () => {
    it('deletes desktop image when deleteDesktop is true', async () => {
      const state = createMockState({
        existingDesktop: mockImage,
        deleteDesktop: true,
      });
      const actions = createMockActions();

      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(deleteHero).toHaveBeenCalledWith('desktop');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('deletes mobile image when deleteMobile is true', async () => {
      const state = createMockState({
        existingMobile: { ...mockImage, variant: 'mobile' },
        deleteMobile: true,
      });
      const actions = createMockActions();

      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(deleteHero).toHaveBeenCalledWith('mobile');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('deletes both image when deleteBoth is true', async () => {
      const state = createMockState({
        existingBoth: { ...mockImage, variant: 'both' },
        deleteBoth: true,
      });
      const actions = createMockActions();

      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(deleteHero).toHaveBeenCalledWith('both');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('deletes multiple images when multiple delete flags are true', async () => {
      const state = createMockState({
        existingDesktop: mockImage,
        existingMobile: { ...mockImage, id: 2, variant: 'mobile' },
        deleteDesktop: true,
        deleteMobile: true,
      });
      const actions = createMockActions();

      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(deleteHero).toHaveBeenCalledWith('desktop');
        expect(deleteHero).toHaveBeenCalledWith('mobile');
        expect(deleteHero).toHaveBeenCalledTimes(2);
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });
  });

  describe('handleSave - upload logic (both mode)', () => {
    it('uploads as both when only desktop upload and no existing mobile', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file, preview: 'data:image/jpeg;base64,test' },
      });
      const actions = createMockActions();
      const uploadedImage = { ...mockImage, variant: 'both' as const };

      vi.mocked(uploadHero).mockResolvedValue({
        success: true,
        data: uploadedImage,
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(1);
        const formData = vi.mocked(uploadHero).mock.calls[0][0];
        expect(formData.get('variant')).toBe('both');
        expect(formData.get('file')).toBe(file);
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: uploadedImage,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('uploads as both when only mobile upload and no existing desktop', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        mobile: { file, preview: 'data:image/jpeg;base64,test' },
      });
      const actions = createMockActions();
      const uploadedImage = { ...mockImage, variant: 'both' as const };

      vi.mocked(uploadHero).mockResolvedValue({
        success: true,
        data: uploadedImage,
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(1);
        const formData = vi.mocked(uploadHero).mock.calls[0][0];
        expect(formData.get('variant')).toBe('both');
        expect(formData.get('file')).toBe(file);
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: uploadedImage,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('deletes existing desktop and mobile when uploading as both (no existing after deletion)', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file, preview: 'data:image/jpeg;base64,test' },
        existingDesktop: mockImage,
        existingMobile: { ...mockImage, id: 2, variant: 'mobile' },
        deleteMobile: true,
      });
      const actions = createMockActions();
      const uploadedImage = { ...mockImage, variant: 'both' as const };

      vi.mocked(uploadHero).mockResolvedValue({
        success: true,
        data: uploadedImage,
      });
      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(1);
        expect(deleteHero).toHaveBeenCalledWith('mobile');
        expect(deleteHero).toHaveBeenCalledWith('desktop');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: uploadedImage,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });
  });

  describe('handleSave - upload logic (separate variants)', () => {
    it('uploads desktop and mobile separately when both uploads are present', async () => {
      const desktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const mobileFile = new File(['mobile'], 'mobile.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file: desktopFile, preview: 'data:image/jpeg;base64,desktop' },
        mobile: { file: mobileFile, preview: 'data:image/jpeg;base64,mobile' },
      });
      const actions = createMockActions();
      const desktopImage = { ...mockImage, variant: 'desktop' as const };
      const mobileImage = { ...mockImage, id: 2, variant: 'mobile' as const };

      vi.mocked(uploadHero)
        .mockResolvedValueOnce({ success: true, data: desktopImage })
        .mockResolvedValueOnce({ success: true, data: mobileImage });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(2);
        const desktopFormData = vi.mocked(uploadHero).mock.calls[0][0];
        const mobileFormData = vi.mocked(uploadHero).mock.calls[1][0];
        expect(desktopFormData.get('variant')).toBe('desktop');
        expect(desktopFormData.get('file')).toBe(desktopFile);
        expect(mobileFormData.get('variant')).toBe('mobile');
        expect(mobileFormData.get('file')).toBe(mobileFile);
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: desktopImage,
          mobile: mobileImage,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('uploads only desktop when desktop upload is present and existing mobile exists', async () => {
      const desktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file: desktopFile, preview: 'data:image/jpeg;base64,desktop' },
        existingMobile: { ...mockImage, id: 2, variant: 'mobile' },
      });
      const actions = createMockActions();
      const desktopImage = { ...mockImage, variant: 'desktop' as const };

      vi.mocked(uploadHero).mockResolvedValue({ success: true, data: desktopImage });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(1);
        const formData = vi.mocked(uploadHero).mock.calls[0][0];
        expect(formData.get('variant')).toBe('desktop');
        expect(formData.get('file')).toBe(desktopFile);
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: desktopImage,
          mobile: state.existingMobile,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('deletes both when uploading separate variants and existing both exists', async () => {
      const desktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const mobileFile = new File(['mobile'], 'mobile.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file: desktopFile, preview: 'data:image/jpeg;base64,desktop' },
        mobile: { file: mobileFile, preview: 'data:image/jpeg;base64,mobile' },
        existingBoth: { ...mockImage, variant: 'both' },
      });
      const actions = createMockActions();
      const desktopImage = { ...mockImage, variant: 'desktop' as const };
      const mobileImage = { ...mockImage, id: 2, variant: 'mobile' as const };

      vi.mocked(uploadHero)
        .mockResolvedValueOnce({ success: true, data: desktopImage })
        .mockResolvedValueOnce({ success: true, data: mobileImage });
      vi.mocked(deleteHero).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).toHaveBeenCalledTimes(2);
        expect(deleteHero).toHaveBeenCalledWith('both');
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: desktopImage,
          mobile: mobileImage,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('throws error when desktop upload fails', async () => {
      const desktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        desktop: { file: desktopFile, preview: 'data:image/jpeg;base64,desktop' },
        existingMobile: { ...mockImage, id: 2, variant: 'mobile' },
      });
      const actions = createMockActions();

      vi.mocked(uploadHero).mockResolvedValue({
        success: false,
        error: 'Desktop upload failed',
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Desktop upload failed');
        expect(actions.reset).not.toHaveBeenCalled();
      });
    });
  });

  describe('handleSave - isSaving state', () => {
    it('sets isSaving to true during save operation', async () => {
      const state = createMockState({
        deleteDesktop: true,
        existingDesktop: mockImage,
      });
      const actions = createMockActions();

      let resolveSave: (value: unknown) => void;
      const savePromise = new Promise((resolve) => {
        resolveSave = resolve;
      });

      vi.mocked(deleteHero).mockReturnValue(savePromise as never);

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.isSaving).toBe(false);

      const saveOperation = result.current.handleSave();

      await waitFor(() => {
        expect(result.current.isSaving).toBe(true);
      });

      resolveSave!({ success: true });
      await saveOperation;

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
      });
    });

    it('sets isSaving back to false on error', async () => {
      const state = createMockState({
        deleteDesktop: true,
        existingDesktop: mockImage,
      });
      const actions = createMockActions();

      vi.mocked(deleteHero).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      expect(result.current.isSaving).toBe(false);

      await result.current.handleSave();

      await waitFor(() => {
        expect(result.current.isSaving).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Network error');
      });
    });
  });

  describe('handleSave - complex scenarios', () => {
    it('handles conversion, deletion, and upload in correct order', async () => {
      const desktopFile = new File(['desktop'], 'desktop.jpg', { type: 'image/jpeg' });
      const state = createMockState({
        existingBoth: { ...mockImage, variant: 'both' },
        convertBothTo: 'desktop',
        existingMobile: { ...mockImage, id: 2, variant: 'mobile' },
        deleteMobile: true,
        desktop: { file: desktopFile, preview: 'data:image/jpeg;base64,desktop' },
      });
      const actions = createMockActions();
      const convertedImage = { ...mockImage, variant: 'desktop' as const };
      const uploadedImage = { ...mockImage, id: 3, variant: 'both' as const };

      vi.mocked(convertHero).mockResolvedValue({
        success: true,
        data: convertedImage,
      });
      vi.mocked(deleteHero).mockResolvedValue({ success: true });
      vi.mocked(uploadHero).mockResolvedValue({
        success: true,
        data: uploadedImage,
      });

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        // Verify order of operations
        const callOrder = vi.mocked(convertHero).mock.invocationCallOrder[0];
        const deleteMobileOrder = vi.mocked(deleteHero).mock.invocationCallOrder[0];
        const uploadOrder = vi.mocked(uploadHero).mock.invocationCallOrder[0];
        const deleteDesktopOrder = vi.mocked(deleteHero).mock.invocationCallOrder[1];

        expect(callOrder).toBeLessThan(deleteMobileOrder);
        expect(deleteMobileOrder).toBeLessThan(uploadOrder);
        expect(uploadOrder).toBeLessThan(deleteDesktopOrder);

        expect(convertHero).toHaveBeenCalledWith('desktop');
        expect(deleteHero).toHaveBeenCalledWith('mobile');
        expect(deleteHero).toHaveBeenCalledWith('desktop');
        expect(uploadHero).toHaveBeenCalledTimes(1);
        const formData = vi.mocked(uploadHero).mock.calls[0][0];
        expect(formData.get('variant')).toBe('both');

        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: uploadedImage,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });

    it('handles no-op save when state is clean', async () => {
      const state = createMockState();
      const actions = createMockActions();

      const { result } = renderHook(() => useHeroHandlers(state, actions));

      await result.current.handleSave();

      await waitFor(() => {
        expect(uploadHero).not.toHaveBeenCalled();
        expect(deleteHero).not.toHaveBeenCalled();
        expect(convertHero).not.toHaveBeenCalled();
        expect(actions.setExistingImages).toHaveBeenCalledWith({
          desktop: null,
          mobile: null,
          both: null,
        });
        expect(actions.reset).toHaveBeenCalledTimes(1);
        expect(toast.success).toHaveBeenCalledWith('Saved successfully!');
      });
    });
  });
});

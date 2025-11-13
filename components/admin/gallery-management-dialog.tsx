'use client';

import { saveGalleryImages } from '@/app/actions/gallery';
import { Image as DBImage } from '@/lib/schema';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { CheckCircle2, GripVertical, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AnimatedBorderButton } from '../auth/animated-border-button';

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

interface NewGalleryImage {
  tempId: string;
  file: File;
  preview: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  dbImage?: {
    id: number;
    publicId: string;
    imageUrl: string;
  };
}

interface CombinedImage {
  id: string | number; // tempId for new, DB id for existing
  url: string;
  filename: string;
  isNew: boolean;
  status?: UploadStatus;
  progress?: number;
  error?: string;
  dbId?: number; // Only for existing images
}

interface GalleryManagementDialogProps {
  isOpen: boolean;
  projectId?: number;
  projectTitle: string;
  images?: DBImage[];
  onClose: () => void;
  onSave?: () => void;
}

export function GalleryManagementDialog({
  isOpen,
  projectId,
  projectTitle,
  images = [],
  onClose,
  onSave,
}: GalleryManagementDialogProps) {
  const [newImages, setNewImages] = useState<NewGalleryImage[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize combined images to prevent recalculation on every render
  const combinedImages = useMemo(() => {
    const existingGalleryImages = images.filter(
      (img) => img.imageType === 'gallery'
    );

    return [
      ...existingGalleryImages
        .filter((img) => !deletedIds.includes(img.id))
        .map((img) => ({
          id: img.id,
          url: img.imageUrl,
          filename: img.publicId.split('/').pop() || 'image',
          isNew: false,
          dbId: img.id,
        })),
      ...newImages
        .filter((img) => img.status !== 'error' || img.error) // Keep errors for retry
        .map((img) => ({
          id: img.tempId,
          url: img.preview,
          filename: img.file.name,
          isNew: true,
          status: img.status,
          progress: img.progress,
          error: img.error,
        })),
    ];
  }, [images, newImages, deletedIds]);

  // Drag and drop setup
  const [dragContainer, orderedImages, setOrderedImages] = useDragAndDrop<
    HTMLDivElement,
    CombinedImage
  >(combinedImages, {
    draggable: (el) => {
      return el.classList.contains('draggable-item');
    },
  });

  // Sync ordered images only when source data changes
  useEffect(() => {
    console.log('run');
    setOrderedImages(combinedImages);
  }, [combinedImages, setOrderedImages]);

  // Cleanup object URLs
  useEffect(() => {
    console.log('run 2');
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [newImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE = 1.5 * 1024 * 1024; // 1.5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    const newImagePreviews: NewGalleryImage[] = files.map((file, index) => {
      const tempId = `new-${Date.now()}-${index}`;
      let status: UploadStatus = 'pending';
      let error: string | undefined;

      // Validate file
      if (file.size > MAX_SIZE) {
        status = 'error';
        error = 'File size exceeds 1.5MB limit';
      } else if (!ALLOWED_TYPES.includes(file.type)) {
        status = 'error';
        error = 'Invalid file type. Allowed: JPEG, PNG, WebP';
      }

      return {
        tempId,
        file,
        preview: URL.createObjectURL(file),
        status,
        progress: 0,
        error,
      };
    });

    setNewImages((prev) => [...prev, ...newImagePreviews]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNew = (tempId: string) => {
    const imageToRemove = newImages.find((img) => img.tempId === tempId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
      setNewImages((prev) => prev.filter((img) => img.tempId !== tempId));
    }
  };

  const handleRemoveExisting = (id: number) => {
    setDeletedIds((prev) => [...prev, id]);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!projectId) {
      toast.error('Project ID is required');
      return;
    }

    setIsSaving(true);

    try {
      // Get only pending files (not errors or already uploaded)
      const filesToUpload = newImages
        .filter((img) => img.status === 'pending')
        .map((img) => img.file);

      // Build position map from ordered images
      const positions = orderedImages.map((img, index) => ({
        id: typeof img.id === 'string' ? img.id : img.id, // Keep as-is (tempId or dbId)
        position: index,
      }));

      // Call server action
      const result = await saveGalleryImages(projectId, {
        newFiles: filesToUpload,
        deletedIds,
        positions,
      });

      if (result.success && result.results) {
        // Update new images with results
        setNewImages((prev) =>
          prev.map((img) => {
            const uploadResult = result.results?.uploaded.find(
              (r) => r.tempId === img.tempId
            );

            if (uploadResult) {
              if (uploadResult.image) {
                return {
                  ...img,
                  status: 'success' as UploadStatus,
                  progress: 100,
                  dbImage: uploadResult.image,
                };
              } else if (uploadResult.error) {
                return {
                  ...img,
                  status: 'error' as UploadStatus,
                  error: uploadResult.error,
                };
              }
            }

            return img;
          })
        );

        // Check if all uploads succeeded
        const allSuccess = result.results.uploaded.every((r) => r.image);

        if (allSuccess) {
          toast.success('Gallery saved successfully');
          onSave?.();
          handleClose();
        } else {
          toast.warning('Some uploads failed. You can retry failed images.');
        }
      } else {
        toast.error(result.error || 'Failed to save gallery');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save gallery');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = (tempId: string) => {
    setNewImages((prev) =>
      prev.map((img) =>
        img.tempId === tempId
          ? { ...img, status: 'pending' as UploadStatus, error: undefined }
          : img
      )
    );
  };

  const handleClose = () => {
    // Clear state
    setNewImages([]);
    setDeletedIds([]);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95 overflow-y-auto">
      <div className="w-full max-w-3xl py-4">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-xl font-light tracking-item-subheading uppercase mb-2">
              MANAGE GALLERY
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              {projectTitle}
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isSaving}
          />

          {/* Upload Zone */}
          <button
            onClick={triggerFileInput}
            disabled={isSaving}
            className="w-full border-2 border-dashed border-muted-foreground/40 py-12 flex flex-col items-center justify-center gap-3 hover:border-muted-foreground/60 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload
              className="w-12 h-12 text-muted-foreground"
              strokeWidth={1}
            />
            <div className="text-center">
              <p className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground">
                DROP IMAGES HERE
              </p>
              <p className="text-xs text-muted-foreground font-light mt-1">
                or click to upload (max 1.5MB, JPEG/PNG/WebP)
              </p>
            </div>
          </button>

          {/* Image List with Drag & Drop */}
          {orderedImages.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground mb-4">
                Gallery Images ({orderedImages.length})
              </h3>
              <div ref={dragContainer} className="space-y-2">
                {orderedImages.map((image) => (
                  <div
                    key={image.id}
                    className="draggable-item flex items-center gap-4 px-4 py-3 border border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors duration-300"
                  >
                    {/* Preview Thumbnail */}
                    <div className="w-16 h-16 shrink-0 bg-muted-foreground/10 relative overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.filename}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Drag Handle */}
                    <GripVertical
                      className="w-4 h-4 text-muted-foreground shrink-0 cursor-move"
                      strokeWidth={1.5}
                    />

                    {/* Filename */}
                    <p className="flex-1 text-sm font-light truncate">
                      {image.filename}
                      {image.isNew && image.status === 'success' && (
                        <span className="ml-2 text-xs text-green-500">
                          (uploaded)
                        </span>
                      )}
                      {image.isNew && image.status === 'pending' && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (new)
                        </span>
                      )}
                    </p>

                    {/* Status Indicator */}
                    {image.status === 'uploading' && (
                      <div className="shrink-0">
                        <div className="text-xs text-muted-foreground">
                          {image.progress}%
                        </div>
                      </div>
                    )}
                    {image.status === 'success' && (
                      <CheckCircle2
                        className="w-5 h-5 text-green-500 shrink-0"
                        strokeWidth={1.5}
                      />
                    )}
                    {image.status === 'error' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-xs text-red-500 max-w-[150px] truncate">
                          {image.error}
                        </div>
                        <button
                          onClick={() => handleRetry(image.id as string)}
                          className="text-xs text-blue-500 hover:text-blue-400 underline"
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        image.isNew
                          ? handleRemoveNew(image.id as string)
                          : handleRemoveExisting(image.dbId!)
                      }
                      disabled={isSaving}
                      className="text-red-500 hover:text-red-400 transition-colors duration-300 shrink-0 disabled:opacity-50"
                    >
                      <X className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm font-light">
              No images in gallery yet
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <AnimatedBorderButton
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1"
            >
              CANCEL
            </AnimatedBorderButton>
            <AnimatedBorderButton
              onClick={handleSave}
              disabled={isSaving || !projectId}
              className="flex-1"
            >
              {isSaving ? 'SAVING...' : 'SAVE'}
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}

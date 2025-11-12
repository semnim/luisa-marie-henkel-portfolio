'use client';

import { GripVertical, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { AnimatedBorderButton } from '../auth/animated-border-button';

interface GalleryImage {
  id: string;
  filename: string;
  url: string;
}

interface NewGalleryImage {
  id: string;
  file: File;
  url: string;
  filename: string;
}

interface GalleryManagementDialogProps {
  isOpen: boolean;
  projectTitle: string;
  images?: GalleryImage[];
  onClose: () => void;
  onUpload?: () => void;
  onRemove?: (id: string) => void;
}

export function GalleryManagementDialog({
  isOpen,
  projectTitle,
  images = [],
  onClose,
  onUpload,
  onRemove,
}: GalleryManagementDialogProps) {
  const [newImages, setNewImages] = useState<NewGalleryImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [newImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImagePreviews = files.map((file) => ({
      id: `new-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      filename: file.name,
    }));
    setNewImages((prev) => [...prev, ...newImagePreviews]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNew = (id: string) => {
    const imageToRemove = newImages.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
      setNewImages((prev) => prev.filter((img) => img.id !== id));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const allImages = [
    ...images.map((img) => ({ ...img, isNew: false })),
    ...newImages.map((img) => ({ ...img, isNew: true })),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95 overflow-y-auto">
      <div className="w-full max-w-3xl py-12">
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
          />

          {/* Upload Zone */}
          <button
            onClick={triggerFileInput}
            className="w-full border-2 border-dashed border-muted-foreground/40 py-12 flex flex-col items-center justify-center gap-3 hover:border-muted-foreground/60 transition-colors duration-300"
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
                or click to upload
              </p>
            </div>
          </button>

          {/* Image List */}
          {allImages.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-sm font-light tracking-item-subheading uppercase text-muted-foreground mb-4">
                Gallery Images ({allImages.length})
              </h3>
              <div className="space-y-2">
                {allImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 px-4 py-3 border border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors duration-300"
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

                    {/* Drag Handle (UI only) */}
                    <GripVertical
                      className="w-4 h-4 text-muted-foreground shrink-0 cursor-move"
                      strokeWidth={1.5}
                    />

                    {/* Filename */}
                    <p className="flex-1 text-sm font-light truncate">
                      {image.filename}
                      {image.isNew && (
                        <span className="ml-2 text-xs text-green-500">
                          (new)
                        </span>
                      )}
                    </p>

                    {/* Remove Button */}
                    <button
                      onClick={() =>
                        image.isNew
                          ? handleRemoveNew(image.id)
                          : onRemove?.(image.id)
                      }
                      className="text-red-500 hover:text-red-400 transition-colors duration-300 shrink-0"
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
          <div className="pt-6">
            <AnimatedBorderButton onClick={onClose} className="w-full">
              DONE
            </AnimatedBorderButton>
          </div>
        </div>
      </div>
    </div>
  );
}

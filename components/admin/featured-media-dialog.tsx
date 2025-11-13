'use client';

import { Monitor, MonitorSmartphone, Smartphone, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
}

interface ExistingImages {
  desktop?: { imageUrl: string };
  mobile?: { imageUrl: string };
  both?: { imageUrl: string };
}

interface FeaturedMediaDialogProps {
  isOpen: boolean;
  project?: FeaturedProject;
  existingImages?: ExistingImages;
  previewMode: 'desktop' | 'mobile';
  onClose: () => void;
  onSave: (media: {
    desktop?: File;
    mobile?: File;
    both?: File;
  }) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function FeaturedMediaDialog({
  isOpen,
  project,
  existingImages,
  previewMode,
  onClose,
  onSave,
}: FeaturedMediaDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<{
    desktop?: File;
    mobile?: File;
    both?: File;
  }>({});

  const [previewUrls, setPreviewUrls] = useState<{
    desktop?: string;
    mobile?: string;
    both?: string;
  }>({});

  const [localPreviewMode, setLocalPreviewMode] = useState<
    'desktop' | 'mobile'
  >(previewMode);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const bothInputRef = useRef<HTMLInputElement>(null);

  // Sync preview mode from parent
  useEffect(() => {
    setLocalPreviewMode(previewMode);
  }, [previewMode]);

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleFileSelect = (
    variant: 'desktop' | 'mobile' | 'both',
    file: File | null
  ) => {
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Error: File can be max. 2MB');
      return;
    }

    // Cleanup old URL if exists
    if (previewUrls[variant]) {
      URL.revokeObjectURL(previewUrls[variant]!);
    }

    // Create new preview URL
    const url = URL.createObjectURL(file);

    setSelectedFiles((prev) => ({ ...prev, [variant]: file }));
    setPreviewUrls((prev) => ({ ...prev, [variant]: url }));

    // Clear other variants if "both" is selected
    if (variant === 'both') {
      if (previewUrls.desktop) URL.revokeObjectURL(previewUrls.desktop);
      if (previewUrls.mobile) URL.revokeObjectURL(previewUrls.mobile);
      setSelectedFiles({ both: file });
      setPreviewUrls({ both: url });
    } else if (selectedFiles.both) {
      // Clear "both" if desktop or mobile is selected
      if (previewUrls.both) URL.revokeObjectURL(previewUrls.both);
      setSelectedFiles((prev) => ({ ...prev, both: undefined }));
      setPreviewUrls((prev) => ({ ...prev, both: undefined }));
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    onSave(selectedFiles);
    handleClose();
  };

  const handleClose = () => {
    // Cleanup URLs
    Object.values(previewUrls).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    setSelectedFiles({});
    setPreviewUrls({});
    onClose();
  };

  // Validation: both OR (desktop AND mobile)
  const isValid =
    selectedFiles.both !== undefined ||
    (selectedFiles.desktop !== undefined &&
      selectedFiles.mobile !== undefined);

  // Determine preview image
  const previewImage =
    selectedFiles.both || localPreviewMode === 'desktop'
      ? previewUrls.both ||
        previewUrls.desktop ||
        existingImages?.both?.imageUrl ||
        existingImages?.desktop?.imageUrl
      : previewUrls.mobile ||
        existingImages?.both?.imageUrl ||
        existingImages?.mobile?.imageUrl;

  const aspectRatio = localPreviewMode === 'desktop' ? '16/9' : '9/16';

  const isDesktopActive = !!selectedFiles.desktop;
  const isMobileActive = !!selectedFiles.mobile;
  const isBothActive = !!selectedFiles.both;
  const isBothDisabled = !!(selectedFiles.desktop || selectedFiles.mobile);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="bg-background border border-muted-foreground/40 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted-foreground/40">
          <h2 className="text-lg font-light tracking-item-subheading uppercase">
            {project.title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview Area */}
          <div
            className="relative w-full bg-muted/20 border border-muted-foreground/40"
            style={{ aspectRatio }}
          >
            {/* Background Image */}
            {previewImage && (
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-cover"
              />
            )}

            {/* Variant Selector Grid (Center) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 bg-background/80 p-6 rounded">
                {/* Desktop */}
                <button
                  onClick={() => desktopInputRef.current?.click()}
                  className="p-4 border border-muted-foreground/40 hover:border-foreground transition-colors"
                >
                  <Monitor
                    className={`w-8 h-8 ${
                      isDesktopActive ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                    strokeWidth={1}
                  />
                </button>

                {/* Both */}
                <button
                  onClick={() => !isBothDisabled && bothInputRef.current?.click()}
                  disabled={isBothDisabled}
                  className="p-4 border border-muted-foreground/40 hover:border-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <MonitorSmartphone
                    className={`w-8 h-8 ${
                      isBothActive ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                    strokeWidth={1}
                  />
                </button>

                {/* Mobile */}
                <button
                  onClick={() => mobileInputRef.current?.click()}
                  className="p-4 border border-muted-foreground/40 hover:border-foreground transition-colors"
                >
                  <Smartphone
                    className={`w-8 h-8 ${
                      isMobileActive ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                    strokeWidth={1}
                  />
                </button>
              </div>
            </div>

            {/* Lower-left: BOTH indicator */}
            {isBothActive && (
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-background/90 text-xs font-light tracking-item-subheading uppercase">
                BOTH
              </div>
            )}

            {/* Lower-right: Preview toggle */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={() => setLocalPreviewMode('desktop')}
                className={`p-2 ${
                  localPreviewMode === 'desktop'
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                } hover:text-foreground transition-colors`}
              >
                <Monitor className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setLocalPreviewMode('mobile')}
                className={`p-2 ${
                  localPreviewMode === 'mobile'
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                } hover:text-foreground transition-colors`}
              >
                <Smartphone className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              ref={desktopInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileSelect('desktop', e.target.files?.[0] || null)
              }
              className="hidden"
            />
            <input
              ref={mobileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileSelect('mobile', e.target.files?.[0] || null)
              }
              className="hidden"
            />
            <input
              ref={bothInputRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileSelect('both', e.target.files?.[0] || null)
              }
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-muted-foreground/40">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-light tracking-item-subheading uppercase border border-muted-foreground/40 hover:border-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-6 py-2 text-sm font-light tracking-item-subheading uppercase bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

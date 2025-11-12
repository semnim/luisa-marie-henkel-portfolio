'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Plus, Pencil, X } from 'lucide-react';

interface MediaUploadBoxProps {
  label: string;
  aspectRatio?: '16/9' | '9/16' | '1/1';
  accept?: 'image' | 'video' | 'both';
  currentMedia?: {
    url: string;
    filename: string;
    type: 'image' | 'video';
  };
  onFileSelect?: (file: File) => void;
  onRemove?: () => void;
}

export function MediaUploadBox({
  label,
  aspectRatio = '16/9',
  accept = 'both',
  currentMedia,
  onFileSelect,
  onRemove,
}: MediaUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptString = () => {
    if (accept === 'image') return 'image/*';
    if (accept === 'video') return 'video/*';
    return 'image/*,video/*';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-light tracking-item-subheading uppercase text-foreground">
        {label}
      </h3>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptString()}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Box with Hover Overlay */}
      <button
        onClick={triggerFileInput}
        className={`relative w-full bg-background border ${
          currentMedia
            ? 'border-muted-foreground/40'
            : 'border-dashed border-muted-foreground/40'
        } transition-colors duration-300 overflow-hidden group cursor-pointer`}
        style={{ aspectRatio }}
      >
        {/* Media Content */}
        {currentMedia ? (
          <>
            {currentMedia.type === 'image' ? (
              <Image
                src={currentMedia.url}
                alt={currentMedia.filename}
                fill
                className="object-cover"
              />
            ) : (
              <video
                src={currentMedia.url}
                className="w-full h-full object-cover"
                muted
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm font-light">
            No media
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {currentMedia ? (
            <Pencil className="w-12 h-12 text-foreground" strokeWidth={1} />
          ) : (
            <Plus className="w-12 h-12 text-foreground" strokeWidth={1} />
          )}
        </div>

        {/* Remove Button (only when media exists) */}
        {currentMedia && (
          <button
            onClick={handleRemoveClick}
            className="absolute top-3 right-3 p-2 bg-background/90 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 hover:text-background z-10"
            aria-label="Remove media"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}
      </button>

      {/* Filename */}
      {currentMedia && (
        <p className="text-xs text-muted-foreground font-light truncate">
          {currentMedia.filename}
        </p>
      )}
    </div>
  );
}

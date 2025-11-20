'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect } from 'react';

type ImageOverlayProps = {
  imageUrl: string;
  alt: string;
  width: number | null;
  height: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ImageOverlay({
  imageUrl,
  alt,
  width,
  height,
  isOpen,
  onClose,
}: ImageOverlayProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-foreground/60 hover:text-foreground text-2xl md:text-4xl font-light transition-colors z-50"
        aria-label="Close"
      >
        ×
      </button>

      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={width || 1200}
          height={height || 1600}
          className={cn(
            'max-w-full max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-4rem)] w-auto h-auto object-contain'
          )}
          unoptimized
          priority
        />
      </div>
    </div>
  );
}

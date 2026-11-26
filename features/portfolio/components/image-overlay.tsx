'use client';

import { useReturnFocus } from '@/hooks/use-return-focus';
import * as Dialog from '@radix-ui/react-dialog';
import { cloudinaryLoader } from '@/lib/cloudinary-loader';
import Image from 'next/image';

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
  const returnFocus = useReturnFocus(isOpen);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/95" />
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={returnFocus}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 outline-none"
        >
          <Dialog.Title className="sr-only">{alt}</Dialog.Title>
          <Dialog.Close
            aria-label="Close"
            className="absolute top-4 right-4 md:top-8 md:right-8 text-foreground/60 hover:text-foreground text-2xl md:text-4xl font-light transition-colors z-50 cursor-pointer"
          >
            <span aria-hidden>×</span>
          </Dialog.Close>

          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={alt}
                width={width || 1200}
                height={height || 1600}
                className="max-w-full max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-4rem)] w-auto h-auto object-contain"
                loader={cloudinaryLoader}
                sizes="100vw"
              />
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

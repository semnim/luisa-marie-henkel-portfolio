'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useReturnFocus } from '@/hooks/use-return-focus';
import { cn } from '@/lib/utils';

type FullscreenDialogProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** False while something is saving, so Escape cannot close the dialog. */
  dismissible?: boolean;
  /** Vertical placement of content that is shorter than the screen. */
  align?: 'center' | 'start';
  /** `alertdialog` for confirmations that need an explicit answer. */
  role?: 'dialog' | 'alertdialog';
  className?: string;
};

/**
 * Modal that covers the whole screen and scrolls its content in a
 * ScrollArea. Radix provides the focus trap, Escape, scroll lock and the
 * dialog semantics; render a FullscreenDialogTitle and a
 * FullscreenDialogDescription inside so the dialog is labelled.
 */
function FullscreenDialog({
  open,
  onClose,
  children,
  dismissible = true,
  align = 'center',
  role = 'dialog',
  className,
}: FullscreenDialogProps) {
  const returnFocus = useReturnFocus(open);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/95" />
        <DialogPrimitive.Content
          role={role}
          onOpenAutoFocus={(event) => {
            // An alert dialog keeps Radix's default: its first button, which
            // is the safe choice. Everything else starts on the scrollable
            // content instead of pre-selecting the first field, so typing
            // cannot overwrite a value and the arrow keys scroll.
            if (role === 'alertdialog') return;
            event.preventDefault();
            viewportRef.current?.focus();
          }}
          onCloseAutoFocus={returnFocus}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          className="fixed inset-0 z-50 outline-none"
        >
          <ScrollArea
            className="h-full"
            viewportProps={{
              ref: viewportRef,
              tabIndex: -1,
              className: 'focus-visible:ring-0 focus-visible:outline-none',
            }}
          >
            <div
              className={cn(
                'flex min-h-dvh justify-center px-6',
                align === 'center' ? 'items-center' : 'items-start',
                className
              )}
            >
              {children}
            </div>
          </ScrollArea>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const FullscreenDialogTitle = DialogPrimitive.Title;
const FullscreenDialogDescription = DialogPrimitive.Description;

export { FullscreenDialog, FullscreenDialogDescription, FullscreenDialogTitle };

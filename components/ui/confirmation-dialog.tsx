'use client';

import { Button } from './button';
import {
  FullscreenDialog,
  FullscreenDialogDescription,
  FullscreenDialogTitle,
} from './fullscreen-dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'danger';
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmationDialogProps) {
  return (
    <FullscreenDialog open={isOpen} onClose={onCancel} role="alertdialog">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <FullscreenDialogTitle className="text-xl font-light tracking-item-subheading uppercase mb-3">
              {title}
            </FullscreenDialogTitle>
            <FullscreenDialogDescription className="text-sm text-muted-foreground font-light">
              {message}
            </FullscreenDialogDescription>
          </div>

          {/* Actions: Cancel comes first, so it gets the initial focus */}
          <div className="flex gap-3">
            <Button onClick={onCancel} className="flex-1">
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              className={`flex-1 ${
                variant === 'danger' ? 'text-red-500 hover:text-red-400' : ''
              }`}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </FullscreenDialog>
  );
}

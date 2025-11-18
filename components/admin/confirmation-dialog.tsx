'use client';

import { Button } from '../ui/button';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-background/95">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-light tracking-item-subheading uppercase mb-3">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              {message}
            </p>
          </div>

          {/* Actions */}
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
    </div>
  );
}

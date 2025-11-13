'use client';

import { Monitor, RotateCcw, Save, Smartphone } from 'lucide-react';

interface MediaToolbarProps {
  previewMode?: 'desktop' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'mobile') => void;
  hasChanges?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  onReset?: () => void;
}

export function MediaToolbar({
  previewMode,
  onPreviewModeChange,
  hasChanges = false,
  isSaving = false,
  onSave,
  onReset,
}: MediaToolbarProps) {
  const hidePreview = !previewMode || !onPreviewModeChange;
  const showActions = hasChanges && onSave && onReset;

  return (
    <div className="flex items-center justify-between">
      {!hidePreview && (
        <div className="flex gap-2 items-center">
          <span className="hidden lg:block text-xs font-light text-muted-foreground uppercase mr-2">
            Preview
          </span>
          <button
            onClick={() => onPreviewModeChange('desktop')}
            className={`p-2 border transition-all ${
              previewMode === 'desktop'
                ? 'border-green-500 text-green-500'
                : 'border-muted-foreground/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Monitor className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onPreviewModeChange('mobile')}
            className={`p-2 border transition-all ${
              previewMode === 'mobile'
                ? 'border-green-500 text-green-500'
                : 'border-muted-foreground/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {showActions && (
        <div className={`flex gap-2 ${hidePreview && 'ml-auto'}`}>
          <button
            onClick={onReset}
            disabled={isSaving}
            className="p-2 text-sm font-light tracking-item-subheading uppercase border text-muted-foreground hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="p-2 text-sm font-light tracking-item-subheading uppercase border text-muted-foreground hover:bg-green-700 hover:opacity-80 transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <Save className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

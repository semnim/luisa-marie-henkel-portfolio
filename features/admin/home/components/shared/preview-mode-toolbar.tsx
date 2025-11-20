'use client';

import { Monitor, Smartphone } from 'lucide-react';
import type { PreviewMode } from '@/features/admin/home/types';

interface PreviewModeToolbarProps {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}

export function PreviewModeToolbar({ mode, onChange }: PreviewModeToolbarProps) {
  return (
    <div className="flex gap-2 items-center">
      <span className="hidden lg:block text-xs font-light text-muted-foreground uppercase mr-2">
        Preview
      </span>
      <button
        onClick={() => onChange('desktop')}
        className={`p-2 border transition-all ${
          mode === 'desktop'
            ? 'border-green-500 text-green-500'
            : 'border-muted-foreground/40 text-muted-foreground hover:text-foreground'
        }`}
      >
        <Monitor className="w-4 h-4" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => onChange('mobile')}
        className={`p-2 border transition-all ${
          mode === 'mobile'
            ? 'border-green-500 text-green-500'
            : 'border-muted-foreground/40 text-muted-foreground hover:text-foreground'
        }`}
      >
        <Smartphone className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

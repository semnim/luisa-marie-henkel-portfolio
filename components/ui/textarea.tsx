import { cn } from '@/lib/utils';
import * as React from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  active?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <div className="relative group">
        <textarea
          className={cn(
            'w-full p-4 text-foreground outline-0 border-muted-foreground border resize-none min-h-[120px] h-full block bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Animated borders */}
        <span
          tabIndex={-1}
          className={cn(
            'absolute top-0 left-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out',
            active && 'w-full'
          )}
        />
        <span
          tabIndex={-1}
          className={cn(
            'absolute top-0 left-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out',
            active && 'h-full'
          )}
        />
        <span
          tabIndex={-1}
          className={cn(
            'absolute bottom-0 right-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out',
            active && 'w-full'
          )}
        />
        <span
          tabIndex={-1}
          className={cn(
            'absolute top-0 right-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out',
            active && 'h-full'
          )}
        />
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({
  className,
  ...props
}: React.ComponentProps<'textarea'> & { active?: boolean }) {
  return (
    <div className="relative group">
      <textarea
        className={cn(
          'w-full p-4 text-foreground outline-0 border-muted-foreground border resize-none min-h-[120px] h-full block',
          className
        )}
        {...props}
      />
      {/* Animated borders */}
      <span
        tabIndex={-1}
        className={`absolute top-0 left-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out ${
          props.active && 'w-full'
        }`}
      />
      <span
        tabIndex={-1}
        className={`absolute top-0 left-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out ${
          props.active && 'h-full'
        }`}
      />
      <span
        tabIndex={-1}
        className={`absolute bottom-0 right-0 w-0 h-px bg-foreground group-focus-within:w-full group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out ${
          props.active && 'w-full'
        }`}
      />
      <span
        tabIndex={-1}
        className={`absolute top-0 right-0 w-px h-0 bg-foreground group-focus-within:h-full group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out ${
          props.active && 'h-full'
        }`}
      />
    </div>
  );
}

export { Textarea };

import { cn } from '@/lib/utils';
import * as React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative group">
        <input
          type={type}
          className={cn(
            'w-full border-0 outline-0 border-muted-foreground rounded-none bg-transparent border-t pt-2 peer file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'absolute top-0 left-0 h-px bg-foreground transition-all duration-500 ease-out',
            props.value
              ? 'w-full'
              : 'w-0 group-focus-within:w-full group-hover:w-full'
          )}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

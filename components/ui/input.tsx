import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, placeholder, type, ...props }, ref) => {
  return (
    <div className="relative group">
      <input
        type={type}
        ref={ref}
        placeholder={placeholder}
        className={cn(
          'w-full border-0 outline-0 border-muted-foreground rounded-none bg-transparent border-t pt-2 peer',
          className
        )}
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
});

Input.displayName = 'Input';

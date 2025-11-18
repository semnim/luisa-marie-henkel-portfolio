import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

export const AnimatedBorderButton = ({
  children,
  className,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <div className="relative" tabIndex={-1}>
      <button
        className={cn(
          `relative w-full group uppercase tracking-item-subheading bg-background border border-muted-foreground px-4 py-2 overflow-hidden font-light transition-colors ${
            props.disabled &&
            'bg-accent/25 text-muted-foreground cursor-not-allowed'
          }`,
          className
        )}
        {...props}
      >
        {!props.disabled && (
          <>
            <span
              tabIndex={-1}
              className="absolute top-0 left-0 w-0 h-px bg-foreground group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out"
            />
            <span
              tabIndex={-1}
              className="absolute top-0 left-0 w-px h-0 bg-foreground group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out"
            />
            <span
              tabIndex={-1}
              className="absolute bottom-0 right-0 w-0 h-px bg-foreground group-focus-visible:w-full group-focus:w-full group-hover:w-full transition-all duration-500 ease-out"
            />
            <span
              tabIndex={-1}
              className="absolute top-0 right-0 w-px h-0 bg-foreground group-focus-visible:h-full group-focus:h-full group-hover:h-full transition-all duration-500 ease-out"
            />
          </>
        )}
        <span tabIndex={-1} className="relative z-10">
          {children}
        </span>
      </button>
    </div>
  );
};

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'relative w-full group uppercase tracking-item-subheading bg-background border border-muted-foreground px-4 py-2 overflow-hidden font-light transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <div className="relative" tabIndex={-1}>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
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
            {props.children}
          </span>
        </Comp>
      </div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

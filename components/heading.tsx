import { cn } from '@/lib/utils';

type Props = {
  title: string;
  subtitle?: string;
  context?: React.ReactNode;
  secondary?: boolean;
  variant?: 'SECTION' | 'HERO' | 'ITEM';
  containerClassName?: string;
};
export const Heading = ({
  title,
  subtitle,
  context,
  secondary,
  variant = 'SECTION',
  containerClassName,
}: Props) => {
  const variants = {
    HERO: {
      title: 'text-5xl tracking-hero-heading uppercase font-light',
      subtitle:
        'text-md mt-4 tracking-hero-heading text-muted-foreground uppercase font-light',
    },
    SECTION: {
      title: 'text-3xl text-center font-light tracking-hero-heading uppercase',
      subtitle:
        'text-xs tracking-item-subheading text-muted-foreground uppercase font-light mt-2',
    },
    ITEM: {
      title:
        'text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading',
      subtitle:
        'text-xs font-light text-foreground lowercase tracking-item-subheading mt-1',
    },
  };

  if (variant === 'ITEM') {
    return (
      <div className={cn(containerClassName, 'text-center z-20')}>
        <p className={variants[variant].title}>{title}</p>
        {subtitle && (
          <span className={variants[variant].subtitle}>{subtitle}</span>
        )}
        {context}
      </div>
    );
  }

  const Component = secondary ? 'h2' : 'h1';
  return (
    <div
      className={cn(
        'relative z-10 text-center flex flex-col items-center justify-center',
        containerClassName
      )}
    >
      <Component className={variants[variant].title}>{title}</Component>
      <p className={variants[variant].subtitle}>{subtitle}</p>
      {context}
    </div>
  );
};

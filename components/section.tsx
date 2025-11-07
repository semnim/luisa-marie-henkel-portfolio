import { cn } from '@/lib/utils';

export const Section = ({
  children,
  variant = 'DEFAULT',
  className,
}: {
  children: React.ReactNode;
  variant?: 'HERO' | 'DEFAULT';
  className?: string;
}) => {
  const variants = {
    DEFAULT: 'h-dvh max-h-dvh md:h-screen md:max-h-screen flex flex-col ',

    HERO: 'h-dvh md:h-screen relative overflow-hidden ',
  };
  return (
    <section className={cn(variants[variant], className)}>{children}</section>
  );
};

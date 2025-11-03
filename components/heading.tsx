type Props = {
  title: string;
  subtitle?: string;
  context?: React.ReactNode;
  secondary?: boolean;
  variant?: 'DEFAULT' | 'HERO' | 'CARD';
};
export const Heading = ({
  title,
  subtitle,
  context,
  secondary,
  variant = 'DEFAULT',
}: Props) => {
  const variants = {
    HERO: {
      title: 'text-5xl tracking-heading uppercase font-light',
      subtitle:
        'text-lg tracking-subheading text-muted-foreground uppercase font-light',
    },
    DEFAULT: {
      title: 'text-3xl text-center font-light tracking-subheading',
      subtitle: '',
    },
    CARD: {
      title:
        'font-bold text-xl w-full px-4 text-center flex items-start justify-center pt-4 lg:pt-8',
      subtitle:
        'text-xs font-light text-foreground lowercase tracking-[0.2rem]',
    },
  };

  if (variant === 'CARD') {
    return (
      <>
        <p className={variants[variant].title}>{title}</p>
        {subtitle && (
          <span className={variants[variant].subtitle}>{subtitle}</span>
        )}
        {context}
      </>
    );
  }

  const Component = secondary ? 'h2' : 'h1';
  return (
    <>
      <Component className={variants[variant].title}>{title}</Component>
      <p className={variants[variant].subtitle}>{subtitle}</p>
      {context}
    </>
  );
};

export const Section = ({
  children,
  variant = 'DEFAULT',
}: {
  children: React.ReactNode;
  variant?: 'HERO' | 'DEFAULT';
}) => {
  const variants = {
    DEFAULT:
      'h-dvh max-h-dvh md:h-screen md:max-h-screen pt-8 pb-8 lg:pb-16 md:pt-24 lg:pt-32 flex flex-col snap-center',
    HERO: 'h-dvh md:h-screen relative overflow-hidden snap-start',
  };
  return <section className={variants[variant]}>{children}</section>;
};

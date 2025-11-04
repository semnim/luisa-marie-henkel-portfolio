export const Container = ({
  children,
  disableScrollSnap = false,
  disableScroll = false,
}: {
  disableScroll?: boolean;
  disableScrollSnap?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <main
      className={`h-dvh md:h-screen ${
        !disableScroll ? 'overflow-y-scroll' : ''
      } ${!disableScrollSnap ? 'snap-y snap-mandatory' : ''}`}
    >
      {children}
    </main>
  );
};

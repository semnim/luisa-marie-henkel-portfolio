export const Container = ({
  children,
  disableScrollSnap = false,
}: {
  disableScrollSnap?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <main
      className={`h-dvh md:h-screen overflow-y-scroll ${
        !disableScrollSnap ? 'snap-y snap-mandatory' : ''
      }`}
    >
      {children}
    </main>
  );
};

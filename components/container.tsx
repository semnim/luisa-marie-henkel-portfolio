export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {children}
    </main>
  );
};

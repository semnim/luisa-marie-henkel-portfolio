export default function NotFound() {
  return (
    <main className="h-dvh w-dvw flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl tracking-hero-heading font-light">
          404
        </h1>
        <p className="text-sm md:text-base tracking-item-subheading text-muted-foreground font-light">
          Page not found
        </p>
      </div>
    </main>
  );
}

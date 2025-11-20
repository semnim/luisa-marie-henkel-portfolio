'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="h-dvh w-dvw flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl tracking-hero-heading font-light">
          ERROR
        </h1>
        <p className="text-sm md:text-base tracking-item-subheading text-muted-foreground font-light max-w-md px-4">
          {error.message || 'Something went wrong'}
        </p>
        <button
          onClick={reset}
          className="text-xs md:text-sm tracking-item-subheading font-light uppercase border border-foreground/20 px-8 py-3 hover:bg-foreground/5 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

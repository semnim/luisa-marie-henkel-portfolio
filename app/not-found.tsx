import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl tracking-hero-heading font-light">
          404
        </h1>
        <p className="text-sm md:text-base tracking-item-subheading text-muted-foreground font-light">
          Page not found
        </p>
        <Link
          href="/"
          className="inline-block text-xs md:text-sm tracking-item-subheading font-light uppercase border-b border-foreground/50 pb-1 transition-colors hover:border-foreground"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

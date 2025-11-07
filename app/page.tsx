import { FeaturedShowcase } from '@/components/home/featured-showcase';
import Image from 'next/image';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function Home() {
  return (
    <main className="snap-y snap-mandatory overflow-y-scroll h-dvh md:h-auto md:overflow-y-hidden">
      <section className="relative h-dvh snap-start">
        <Image
          src={'/assets/home_hero.webp'}
          className="object-cover z-0"
          fill
          alt="homepage hero fallback image"
        />
        <div className="text-center z-20 absolute inset-0 flex flex-col items-center justify-center gradient-easing">
          <h1 className="text-xl md:text-5xl tracking-hero-heading font-light">
            LUISA-MARIE HENKEL
          </h1>
          <p className="text-xs md:text-md mt-4 tracking-hero-heading text-muted-foreground font-light">
            ART DIRECTOR & STYLIST
          </p>
        </div>
      </section>
      <section className="relative h-dvh md:h-screen md:max-h-screen flex flex-col snap-start overflow-hidden">
        <h2 className="text-lg md:text-3xl w-fit mx-auto text-center font-light tracking-hero-heading z-50 h-15 sticky -top-15 bg-background flex items-center">
          FEATURED
        </h2>
        <FeaturedShowcase />
      </section>
    </main>
  );
}

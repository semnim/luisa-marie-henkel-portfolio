import { FeaturedShowcase } from '@/components/home/featured-showcase';
import Image from 'next/image';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function Home() {
  const heroSrc = '/assets/home_hero.webp';
  const heroAlt = 'homepage hero fallback image';

  return (
    <main className="snap-y snap-mandatory overflow-y-scroll h-dvh md:h-auto md:overflow-y-hidden overscroll-none">
      <section className="relative h-dvh snap-start">
        <Image src={heroSrc} className="object-cover z-0" fill alt={heroAlt} />
        <div className="text-center z-20 absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-5xl tracking-hero-heading font-light">
            LUISA-MARIE HENKEL
          </h1>
          <p className="text-xs md:text-md mt-4 tracking-hero-heading text-muted-foreground font-light">
            ART DIRECTOR & STYLIST
          </p>
        </div>
      </section>
      <section className="relative h-dvh md:h-screen md:max-h-screen flex flex-col snap-start overflow-hidden">
        <h2 className="font-light text-lg md:text-3xl h-20 md:h-50 w-full flex items-center justify-center  tracking-hero-heading z-10 bottom-0 absolute bg-linear-to-t from-background md:via-75% md:via-black/75 to-transparent left-1/2 -translate-x-1/2">
          FEATURED
        </h2>
        <FeaturedShowcase images={[]} />
      </section>
    </main>
  );
}

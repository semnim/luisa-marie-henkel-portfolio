import { fetchFeaturedProjects } from '@/app/actions/featured';
import { fetchCurrentHero } from '@/app/actions/hero';
import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function Home() {
  // Fetch hero images from database
  const heroResult = await fetchCurrentHero();
  const heroImages =
    heroResult.success && heroResult.data ? heroResult.data : {};

  // Fetch featured projects
  const featuredResult = await fetchFeaturedProjects();
  const featuredProjects =
    featuredResult.success && featuredResult.data ? featuredResult.data : [];

  // Fallback logic
  const heroDesktop =
    heroImages.both?.imageUrl ||
    heroImages.desktop?.imageUrl ||
    '/assets/home_hero.webp';

  const heroMobile =
    heroImages.both?.imageUrl || heroImages.mobile?.imageUrl || heroDesktop;

  const heroAlt =
    heroImages.both?.altText || heroImages.desktop?.altText || 'homepage hero';

  return (
    <main className="snap-y snap-mandatory overflow-y-scroll h-dvh md:h-auto md:overflow-y-hidden overscroll-none">
      <section className="relative h-dvh snap-start">
        {/* Desktop Hero */}
        <Image
          src={heroDesktop}
          className="hidden md:block object-cover z-0"
          fill
          sizes="(min-width: 768px) 100vw, 0px"
          alt={heroAlt}
          priority
        />
        {/* Mobile Hero */}
        <Image
          src={heroMobile}
          className="md:hidden object-cover z-0"
          fill
          sizes="(max-width: 767px) 100vw, 0px"
          alt={heroAlt}
          priority
        />
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
        <div className="font-light w-full pb-2 flex flex-col items-center justify-end absolute bg-linear-to-t from-background md:via-75% md:via-black/75 to-transparent left-1/2 -translate-x-1/2 bottom-0 z-10 h-20 md:h-50">
          <h2 className="text-lg md:text-3xl tracking-hero-heading">
            FEATURED
          </h2>
          <p className="text-xs mt-2 tracking-widest text-foreground font-light">
            A CURATED SELECTION
          </p>
          <Button variant={'link'} className="mt-4 text-xs">
            <Link href="/portfolio">SEE ALL PROJECTS</Link>
          </Button>
        </div>
        <FeaturedShowcase projects={featuredProjects} />
      </section>
    </main>
  );
}

import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { HomeCta } from '@/components/home/home-cta';
import { fetchFeaturedProjects } from '@/features/home/actions/fetch-featured';
import { fetchCurrentHero } from '@/features/home/actions/fetch-hero';
import Image from 'next/image';

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
          unoptimized
        />
        {/* Mobile Hero */}
        <Image
          src={heroMobile}
          className="md:hidden object-cover z-0"
          fill
          sizes="(max-width: 767px) 100vw, 0px"
          alt={heroAlt}
          priority
          unoptimized
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
        <FeaturedShowcase projects={featuredProjects} />
        <HomeCta />
      </section>
    </main>
  );
}

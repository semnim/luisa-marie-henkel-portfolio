import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { db } from '@/lib/db';
import { siteImages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

async function getFeaturedImages() {
  const images = await db
    .select()
    .from(siteImages)
    .where(eq(siteImages.imageType, 'featured'))
    .orderBy(siteImages.order);
  return images;
}

async function getHomeHero() {
  const [hero] = await db
    .select()
    .from(siteImages)
    .where(eq(siteImages.imageType, 'home_hero'))
    .limit(1);
  return hero;
}

export default async function Home() {
  const [featuredImages, homeHero] = await Promise.all([
    getFeaturedImages(),
    getHomeHero(),
  ]);
  // Fallback to static assets if DB is empty
  const heroSrc = homeHero?.publicId || '/assets/home_hero.webp';
  const heroAlt = homeHero?.altText || 'homepage hero fallback image';

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
        <FeaturedShowcase images={featuredImages} />
      </section>
    </main>
  );
}

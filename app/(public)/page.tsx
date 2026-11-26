import { fetchFeaturedProjects } from '@/features/home/actions/fetch-featured';
import { fetchCurrentHero } from '@/features/home/actions/fetch-hero';
import { FeaturedShowcase } from '@/features/home/components/featured-showcase';
import { ArtDirectedImage } from '@/components/ui/fade-image';

export const metadata = {
  description:
    'Fashion and editorial art direction and styling. View selected works and creative projects.',
};

const HERO_TITLE = 'LUISA-MARIE HENKEL';
const HERO_SUBTITLE = 'ART DIRECTOR & STYLIST';
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
  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Luisa-Marie Henkel',
    jobTitle: ['Art Director', 'Stylist'],
    url: 'https://luisamariehenkel.com',
    sameAs: ['https://www.instagram.com/oh_luisa/'],
    workExample: featuredProjects.map((project) => ({
      '@type': 'CreativeWork',
      name: project.projectTitle,
    })),
  };

  return (
    <main data-mobile-snap>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative h-lvh snap-start">
        <ArtDirectedImage
          desktop={{ src: heroDesktop }}
          mobile={{ src: heroMobile }}
          alt={heroAlt}
          className="object-cover z-0"
        />
        <div className="text-center z-20 absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-xl md:text-5xl tracking-hero-heading font-light">
            {HERO_TITLE}
          </h1>
          <p className="text-xs md:text-sm mt-4 tracking-hero-heading text-foreground/80 font-light">
            {HERO_SUBTITLE}
          </p>
        </div>
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 pb-[calc(var(--bar-clearance)+1.5rem)] text-[10px] tracking-item-subheading text-foreground/70 uppercase"
        >
          Scroll
          <span className="h-10 w-px bg-foreground/50" />
        </div>
      </section>
      <section className="snap-start">
        <FeaturedShowcase projects={featuredProjects} />
      </section>
    </main>
  );
}

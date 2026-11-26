import {
  fetchAllProjects,
  fetchProjectData,
  fetchProjectImages,
} from '@/features/portfolio/actions/fetch-projects';
import { HeroSection } from '@/features/portfolio/components/hero-section';
import { ProjectGallery } from '@/features/portfolio/components/project-gallery';
import { ProjectMetadata } from '@/features/portfolio/components/project-metadata';
import { getProjectTitleFromSlug } from '@/lib/utils';
import type { Metadata } from 'next';
import { ArtDirectedImage } from '@/components/ui/fade-image';
import type { Image } from '@/lib/schema';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/** Hero per breakpoint, falling back to the shared one, then to any image. */
function pickHeroImages(images: Image[]) {
  const heroOf = (variant: Image['variant']) =>
    images.find(
      (img) => img.imageType === 'project_hero' && img.variant === variant
    );
  const fallback = heroOf('both') ?? images[0];
  return {
    desktop: heroOf('desktop') ?? fallback,
    mobile: heroOf('mobile') ?? fallback,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const projectData = await fetchProjectData(slug);
  const projectImages = await fetchProjectImages(slug);
  const title = getProjectTitleFromSlug(slug);

  const thumbnail = projectImages.find((img) => img.imageType === 'thumbnail');
  const ogImage = thumbnail?.imageUrl || '/opengraph-image.png';

  return {
    title: title.toUpperCase(),
    description:
      projectData?.description ||
      `${title.toUpperCase()} - Art direction & styling project by Luisa-Marie Henkel`,
    openGraph: {
      title: title.toUpperCase(),
      description:
        projectData?.description ||
        `${title.toUpperCase()} - Art direction & styling project`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      publishedTime: projectData?.publishedAt?.toISOString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: title.toUpperCase(),
      description:
        projectData?.description ||
        `${title.toUpperCase()} - Art direction & styling project`,
      images: [ogImage],
    },
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectImages = await fetchProjectImages(slug);
  const title = getProjectTitleFromSlug(slug);
  const projectData = await fetchProjectData(slug);
  // Handle empty state
  if (projectImages.length === 0 || projectData === undefined) {
    return (
      <main>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-light mb-4">{title}</h1>
            <p className="text-muted-foreground">Images coming soon</p>
          </div>
        </div>
      </main>
    );
  }

  const hero = pickHeroImages(projectImages);

  // "Next project" wraps around, so the page never ends in a dead end
  const allProjects = await fetchAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : undefined;

  const nextHero = nextProject
    ? pickHeroImages(await fetchProjectImages(nextProject.slug))
    : undefined;

  const galleryImages = projectImages.filter(
    (img) => img.imageType === 'gallery'
  );

  // JSON-LD structured data
  const thumbnail = projectImages.find((img) => img.imageType === 'thumbnail');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description: projectData.description,
    creator: {
      '@type': 'Person',
      name: 'Luisa-Marie Henkel',
      jobTitle: ['Art Director', 'Stylist'],
    },
    image: thumbnail?.imageUrl,
    datePublished: projectData.publishedAt?.toISOString(),
    ...(projectData.client && { client: projectData.client }),
    ...(projectData.category && { genre: projectData.category }),
  };

  return (
    <main data-mobile-snap>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="md:h-dvh md:max-h-dvh relative">
        <HeroSection
          desktopHeroImage={{
            url: hero.desktop.imageUrl,
            alt: title,
          }}
          mobileHeroImage={{
            url: hero.mobile.imageUrl,
            alt: title,
          }}
          title={title}
          client={projectData.client}
          category={projectData.category}
          publishedAt={projectData.publishedAt}
        />
        <ProjectMetadata
          description={projectData.description}
          team={projectData.team}
        />
      </div>
      <ProjectGallery images={galleryImages} />
      <nav
        aria-label="More projects"
        className={
          nextProject
            ? 'relative h-lvh snap-start overflow-hidden md:h-[85dvh]'
            : 'relative h-24 snap-start'
        }
      >
        {nextProject && (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="group absolute inset-0 flex flex-col justify-end px-6 pb-[calc(var(--bar-clearance)+6rem)] -outline-offset-2 md:px-10 md:pb-28"
          >
            {nextHero && (
              <ArtDirectedImage
                lazy
                desktop={{ src: nextHero.desktop.imageUrl }}
                mobile={{ src: nextHero.mobile.imageUrl }}
                alt=""
                className="object-cover brightness-[.6] transition-[scale,filter,opacity] duration-1000 ease-out group-hover:scale-105 group-hover:brightness-75 motion-reduce:transition-none"
              />
            )}
            {/* The image dissolves into the page background, top and bottom,
                so there is no hard edge around the links. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 hidden h-40 bg-linear-to-b from-background to-transparent md:block"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-background from-10% via-background/70 via-45% to-transparent"
            />
            <span className="relative text-[11px] tracking-item-subheading text-foreground/70 uppercase">
              Next project
            </span>
            <span className="relative mt-3 text-4xl leading-tight font-light tracking-item-subheading uppercase md:text-7xl">
              {nextProject.title}
            </span>
            <span className="relative mt-6 flex items-center gap-3 text-xs tracking-item-subheading uppercase">
              View project
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                strokeWidth={1.25}
              />
            </span>
          </Link>
        )}
        <Link
          href="/portfolio"
          className="group absolute inset-x-0 bottom-[calc(var(--bar-clearance)+0.5rem)] flex h-14 items-center justify-between px-6 text-xs tracking-item-subheading text-foreground/70 uppercase transition-colors -outline-offset-2 hover:text-foreground md:bottom-4 md:px-10"
        >
          All projects
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            strokeWidth={1.25}
          />
        </Link>
      </nav>
    </main>
  );
}

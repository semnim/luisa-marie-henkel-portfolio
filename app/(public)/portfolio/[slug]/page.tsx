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
import Link from 'next/link';

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

  // Filter hero and gallery images by type
  const heroDesktop = projectImages.find(
    (img) => img.imageType === 'project_hero' && img.variant === 'desktop'
  );
  const heroMobile = projectImages.find(
    (img) => img.imageType === 'project_hero' && img.variant === 'mobile'
  );
  const heroBoth = projectImages.find(
    (img) => img.imageType === 'project_hero' && img.variant === 'both'
  );

  // Determine which images to use
  const desktopHeroImage = heroDesktop || heroBoth || projectImages[0];
  const mobileHeroImage = heroMobile || heroBoth || projectImages[0];

  // "Next project" wraps around, so the page never ends in a dead end
  const allProjects = await fetchAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
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
            url: desktopHeroImage.imageUrl,
            alt: title,
          }}
          mobileHeroImage={{
            url: mobileHeroImage.imageUrl,
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
        className="snap-start flex flex-col items-center gap-8 px-8 py-24 text-center"
      >
        {nextProject && (
          <Link
            href={`/portfolio/${nextProject.slug}`}
            className="group flex flex-col items-center gap-3"
          >
            <span className="text-xs uppercase tracking-item-subheading text-muted-foreground">
              Next project
            </span>
            <span className="text-2xl md:text-4xl font-light uppercase tracking-hero-heading border-b border-transparent pb-1 transition-colors group-hover:border-foreground">
              {nextProject.title}
            </span>
          </Link>
        )}
        <Link
          href="/portfolio"
          className="text-xs uppercase tracking-item-subheading border-b border-foreground/50 pb-1 transition-colors hover:border-foreground"
        >
          All projects
        </Link>
      </nav>
    </main>
  );
}

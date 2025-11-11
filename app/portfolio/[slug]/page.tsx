import { Container } from '@/components/container';
import { HeroSection } from '@/components/work/hero-section';
import { ProjectGallery } from '@/components/work/project-gallery';
import { ProjectMetadata } from '@/components/work/project-metadata';
import { getProjectTitleFromSlug } from '@/lib/utils';
import { fetchProjectImages } from './actions';

export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectImages = await fetchProjectImages(slug);
  const title = getProjectTitleFromSlug(slug);

  // Handle empty state
  if (projectImages.length === 0) {
    return (
      <Container>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-light mb-4">{title}</h1>
            <p className="text-muted-foreground">Images coming soon</p>
          </div>
        </div>
      </Container>
    );
  }

  // Filter hero and gallery images by type
  const heroImage =
    projectImages.find((img) => img.imageType === 'hero') || projectImages[0];
  const galleryImages = projectImages.filter(
    (img) => img.imageType === 'gallery'
  );

  // Placeholder data - will come from DB later
  const projectData = {
    client: 'Sample Client',
    category: 'editorial' as const,
    publishedAt: new Date('2024-01-15'),
    description:
      'A stunning editorial showcase featuring bold styling choices and innovative visual storytelling. This project pushes the boundaries of contemporary fashion photography.',
  };

  return (
    <main
      className={
        'max-h-[calc(100dvh-60px)] h-[calc(100dvh-60px)] overflow-y-scroll snap-y snap-mandatory mt-15'
      }
    >
      <HeroSection
        heroImage={{
          publicId: heroImage.publicId,
          alt: title,
        }}
        title={title}
        client={projectData.client}
        category={projectData.category}
        publishedAt={projectData.publishedAt}
      />
      <ProjectMetadata
        description={projectData.description}
        category={projectData.category}
      />
      <ProjectGallery images={galleryImages} title={title} />
    </main>
  );
}

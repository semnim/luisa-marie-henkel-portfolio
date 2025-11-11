import { Container } from '@/components/container';
import { HeroSection } from '@/components/work/hero-section';
import { ProjectGallery } from '@/components/work/project-gallery';
import { ProjectMetadata } from '@/components/work/project-metadata';
import { getProjectTitleFromSlug } from '@/lib/utils';
import { fetchProjectData, fetchProjectImages } from './actions';

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
  const projectData = await fetchProjectData(slug);
  // Handle empty state
  if (projectImages.length === 0 || projectData === undefined) {
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

  return (
    <main
      className={
        'max-h-dvh h-dvh overflow-y-scroll snap-y snap-mandatory md:snap-none'
      }
    >
      <div className="md:h-dvh md:max-h-dvh relative">
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
          team={projectData.team}
        />
      </div>
      <ProjectGallery images={galleryImages} title={title} />
    </main>
  );
}

import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Image } from '@/components/image';
import { Section } from '@/components/section';
import { MasonryGrid } from '@/components/work/masonry-grid';
import { createSlugFromProjectTitle } from '@/lib/utils';
import Link from 'next/link';
import { fetchProjects } from './actions';
export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function WorkPage() {
  const projects = await fetchProjects();
  return (
    <Container disableScrollSnap disableScroll>
      <Heading
        title="PROJECTS"
        containerClassName="fixed inset-x-0 md:relative pt-8 lg:pt-32 lg:pb-8"
      />
      <Section className="overflow-y-scroll md:overflow-y-hidden max-h-dvh snap-y snap-mandatory md:snap-none md:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 relative">
          {projects.map((item, index) => {
            if (item === null) {
              return <div className="h-0" key={'empty' + index} />;
            }
            return (
              <Link
                href={`/work/${createSlugFromProjectTitle(item.title)}`}
                key={item.id}
                className={` group overflow-hidden snap-center relative h-dvh lg:h-[500px]`}
              >
                <figure
                  key={item.id}
                  className="flex flex-1 w-full h-full sticky top-0"
                >
                  <Image
                    src={item.thumbnailPublicId}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  />
                  <figcaption className="backdrop-brightness-75 absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-center items-center h-full">
                    <Heading variant="ITEM" title={item.title} />
                  </figcaption>
                </figure>
              </Link>
            );
          })}
        </div>
      </Section>
      <Section>
        <MasonryGrid
          images={projects.map((project) => ({
            id: project.id,
            publicId: project.thumbnailPublicId,
            imageUrl: project.thumbnailUrl,
            width: null,
            height: null,
            title: project.title,
          }))}
          title={'Projects'}
        />
        )
      </Section>
    </Container>
  );
}

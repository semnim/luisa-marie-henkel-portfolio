import { Heading } from '@/components/heading';
import { Image } from '@/components/image';
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
    <main className="md:h-screen">
      <h2 className="text-md md:text-xl w-fit mx-auto text-center font-light tracking-hero-heading z-50 h-15 fixed top-0 left-1/2 -translate-x-1/2 flex items-center">
        PROJECTS
      </h2>
      <section className="h-dvh md:h-screen md:max-h-screen flex flex-col overflow-y-scroll md:overflow-y-hidden max-h-dvh md:snap-none md:hidden snap-mandatory snap-y">
        <div className="grid grid-cols-1 lg:grid-cols-3 relative">
          {projects.map((item, index) => {
            if (item === null) {
              return <div className="h-0" key={'empty' + index} />;
            }
            return (
              <Link
                href={`/work/${createSlugFromProjectTitle(item.title)}`}
                key={item.id}
                className={` group overflow-hidden snap-start relative h-dvh lg:h-[500px]`}
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
      </section>
      <section className="mt-15 h-dvh max-h-dvh md:h-[calc(100dvh-60px)] md:max-h-[calc(100dvh-60px)] flex-col hidden md:block">
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
      </section>
    </main>
  );
}

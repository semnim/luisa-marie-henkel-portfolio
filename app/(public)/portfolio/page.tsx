import { IndexPopover } from '@/components/portfolio/index-popover';
import { MasonryGrid } from '@/components/work/masonry-grid';
import { createSlugFromProjectTitle } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProjects } from './actions';

export const metadata = {
  title: 'Projects',
  description: 'Art director & Stylist portfolio',
};

export default async function WorkPage() {
  const projects = await fetchProjects();
  return (
    <main className="md:h-screen">
      <h2 className="hidden text-md md:text-xl w-fit mx-auto text-center font-light tracking-hero-heading z-20 h-15 fixed top-0 left-1/2 -translate-x-1/2 md:flex items-center mix-blend-difference">
        PROJECTS
      </h2>
      <section className="h-dvh md:h-screen md:max-h-screen flex flex-col overflow-y-scroll md:overflow-y-hidden max-h-dvh md:snap-none md:hidden snap-mandatory snap-y overscroll-none">
        <div className="grid grid-cols-1 lg:grid-cols-3 relative">
          <div className="group overflow-hidden snap-start relative h-dvh lg:h-[500px] flex items-center bg-linear-to-b from-background via-background/95 to-background">
            <div className="w-full my-auto text-center space-y-6 px-8">
              <div className="space-y-4">
                <h2 className="text-xl font-light tracking-hero-heading">
                  PROJECTS
                </h2>
                <p className="text-xs tracking-widest text-muted-foreground font-light before:content-['—'] before:mr-3 after:content-['—'] after:ml-3">
                  EXPLORE THE PORTFOLIO
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 pt-4">
                <p className="text-[10px] tracking-wider text-muted-foreground/70 uppercase absolute bottom-4">
                  <ChevronDown />
                </p>
              </div>
            </div>
          </div>
          {projects.map((item, index) => {
            if (item === null) {
              return <div className="h-0" key={'empty' + index} />;
            }
            const thumbnail = item.images.find(
              (image) => image.imageType === 'thumbnail'
            );
            return (
              <Link
                href={`/portfolio/${createSlugFromProjectTitle(item.title)}`}
                key={item.id}
                className="group overflow-hidden snap-start relative h-dvh lg:h-[500px]"
              >
                <figure
                  key={item.id}
                  className="flex flex-1 w-full h-full relative"
                >
                  <Image
                    unoptimized
                    src={thumbnail?.imageUrl ?? ''}
                    alt={item.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 0px"
                    className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  />
                  <figcaption className="backdrop-brightness-75 absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-center items-center h-full">
                    <div className="text-center z-20">
                      <p className="text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading">
                        {item.title}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Link>
            );
          })}
          <IndexPopover projects={projects} />
        </div>
      </section>
      <section className="h-dvh max-h-dvh md:h-[calc(100dvh-60px)] md:max-h-[calc(100dvh-60px)] flex-col hidden md:block">
        <MasonryGrid
          images={projects.map((project) => {
            const thumbnail = project.images.find(
              (i) => i.imageType === 'thumbnail'
            );
            return {
              id: project.id,
              publicId: thumbnail?.publicId ?? '',
              imageUrl: thumbnail?.imageUrl ?? '',
              width: null,
              height: null,
              title: project.title,
            };
          })}
          title={'Projects'}
        />
      </section>
    </main>
  );
}

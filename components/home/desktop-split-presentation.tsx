import { FeaturedProject } from '@/features/home/actions/fetch-featured';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  projects: FeaturedProject[];
};
export const DesktopSplitPresentation = ({ projects }: Props) => {
  return (
    <div className="hidden md:block relative flex-1">
      <div className="flex flex-nowrap flex-1 relative">
        {projects
          .filter((p) => p.images.desktop || p.images.both)
          .map((project, index) => {
            // Determine image URL based on breakpoint
            const imageUrl =
              project.images.both?.imageUrl || project.images.desktop?.imageUrl;

            return (
              <Link
                className="group relative overflow-hidden flex shrink-0 flex-1 h-dvh"
                key={index}
                href={`/portfolio/${project.projectSlug}`}
              >
                <figure className="flex flex-1 relative">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.projectTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover lg:object-[50%_20%] xl:object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                      unoptimized
                    />
                  ) : null}
                  <figcaption className="absolute inset-0 hidden bottom-0 group-hover:flex flex-col justify-start items-center h-full bg-linear-to-b from-black/50 to-transparent mb-auto">
                    <div className="h-full flex items-center justify-center flex-col text-center z-20">
                      <p className="text-md w-full px-4 text-center flex items-start justify-center tracking-item-heading">
                        {project.projectTitle}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

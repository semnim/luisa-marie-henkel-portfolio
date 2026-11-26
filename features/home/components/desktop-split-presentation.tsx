import { FadeImage as Image } from '@/components/ui/fade-image';
import type { FeaturedProject } from '@/features/home/actions/fetch-featured';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  projects: FeaturedProject[];
};

/**
 * Featured projects from md up: full-height panels side by side. The panel
 * under the pointer widens while the others dim. A strip underneath names
 * the section and links to the full list.
 */
export const DesktopSplitPresentation = ({ projects }: Props) => {
  const panels = projects.flatMap((project) => {
    const image = project.images.both ?? project.images.desktop;
    return image ? [{ project, imageUrl: image.imageUrl }] : [];
  });

  return (
    <div className="hidden h-dvh flex-col md:flex">
      <ul className="group/panels flex min-h-0 flex-1">
        {panels.map(({ project, imageUrl }, index) => (
          <li
            key={`${project.projectSlug}-${project.position}`}
            className="min-w-0 flex-1 transition-[flex-grow,filter] duration-700 ease-out group-hover/panels:not-hover:brightness-50 hover:grow-[1.6] focus-within:grow-[1.6] motion-reduce:transition-none"
          >
            <Link
              href={`/portfolio/${project.projectSlug}`}
              className="group relative block h-full overflow-hidden -outline-offset-2"
            >
              <Image
                src={imageUrl}
                alt=""
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 motion-reduce:transition-none lg:object-[50%_20%] xl:object-center"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent px-6 pt-40 pb-6">
                <p className="text-xs tracking-item-subheading text-foreground/60 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <p className="mt-2 text-xl font-light tracking-item-subheading uppercase lg:text-2xl">
                  {project.projectTitle}
                </p>
                <p className="mt-0 flex max-h-0 items-center gap-2 overflow-hidden text-xs tracking-item-subheading uppercase opacity-0 transition-all duration-500 group-hover:mt-4 group-hover:max-h-6 group-hover:opacity-100 group-focus-visible:mt-4 group-focus-visible:max-h-6 group-focus-visible:opacity-100 motion-reduce:transition-none">
                  View project
                  <ArrowRight
                    aria-hidden
                    className="size-4"
                    strokeWidth={1.25}
                  />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex h-14 shrink-0 items-center justify-between px-6 text-xs tracking-item-subheading uppercase">
        <h2>
          Featured
          <span className="text-foreground/50"> — a curated selection</span>
        </h2>
        <Link
          href="/portfolio"
          className="group flex items-center gap-2 py-3"
        >
          All projects
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            strokeWidth={1.25}
          />
        </Link>
      </div>
    </div>
  );
};

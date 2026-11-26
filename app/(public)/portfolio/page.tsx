import { FadeImage } from '@/components/ui/fade-image';
import { fetchAllProjectsWithImages } from '@/features/portfolio/actions/fetch-projects';
import { IndexPopover } from '@/features/portfolio/components/index-popover';
import { createSlugFromProjectTitle } from '@/lib/utils';
import { SnapMarker } from '@/components/ui/snap-marker';
import Link from 'next/link';

export const metadata = {
  title: 'Portfolio',
  description:
    'Fashion art direction and styling work spanning commercial campaigns, premium brands, and editorial projects.',
};

export default async function WorkPage() {
  const projects = await fetchAllProjectsWithImages();
  const tiles = projects.flatMap((project) => {
    const thumbnail = project.images.find((i) => i.imageType === 'thumbnail');
    return thumbnail
      ? [
          {
            id: project.id,
            title: project.title,
            category: project.category,
            href: `/portfolio/${createSlugFromProjectTitle(project.title)}`,
            imageUrl: thumbnail.imageUrl,
            alt: thumbnail.altText || project.title,
          },
        ]
      : [];
  });

  return (
    <main data-mobile-snap>
      {/* Phones go straight to the first project; the heading stays for
          screen readers. From md up it sits above the grid. */}
      <h1 className="sr-only md:not-sr-only md:flex md:h-15 md:items-center md:justify-center md:text-xl font-light tracking-hero-heading">
        PROJECTS
      </h1>

      {/* One full-screen project per swipe on phones, a uniform grid above */}
      <ul className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1 md:p-1">
        {tiles.map((tile, index) => (
          <li key={tile.id} className="relative">
            <SnapMarker />
            <Link
              href={tile.href}
              className="group relative block h-(--screen) md:h-auto md:aspect-[3/4] overflow-hidden -outline-offset-2"
            >
              <FadeImage
                src={tile.imageUrl}
                alt={tile.alt}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                loading={index === 0 ? 'eager' : undefined}
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-6 pt-24 pb-[calc(var(--bar-clearance)+3.5rem)] md:px-4 md:pt-16 md:pb-4">
                <p className="text-lg md:text-sm tracking-item-heading uppercase">
                  {tile.title}
                </p>
                <p className="mt-1 text-xs tracking-item-subheading uppercase text-foreground/70">
                  {tile.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="md:hidden">
        <IndexPopover projects={projects} />
      </div>
    </main>
  );
}

import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';
import { createSlugForWorkItem } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

const PROJECTS = [
  {
    id: 1,
    title: 'Been Down For So Long',
    thumbnailUrl: '/placeholders/1/1.webp',
  },
  { id: 2, title: 'Tangled Manners', thumbnailUrl: '/placeholders/2/1.webp' },
  { id: 3, title: 'Madame Rêve', thumbnailUrl: '/placeholders/3/1.webp' },
  { id: 4, title: 'Brothers', thumbnailUrl: '/placeholders/4/1.webp' },
  { id: 5, title: 'Fading Ties', thumbnailUrl: '/placeholders/4/2.webp' },
  {
    id: 6,
    title: 'Pioneer to the falls',
    thumbnailUrl: '/placeholders/4/3.webp',
  },
  {
    id: 7,
    title: 'Les Nocés Funebres',
    thumbnailUrl: '/placeholders/4/4.webp',
  },
];
export default function WorkPage() {
  return (
    <Container disableScrollSnap>
      <Section>
        <Heading title="PROJECTS" />
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 py-4">
          {PROJECTS.map((item) => {
            return (
              <Link
                href={`/work/${createSlugForWorkItem(item.title)}`}
                key={item.id}
                className="relative group overflow-hidden"
              >
                <figure key={item.id} className="flex flex-1">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  />
                  <figcaption className="absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-start items-center h-50 bg-linear-to-b from-black/75 to-transparent mb-auto">
                    <p className="font-bold text-xl w-full px-4 text-center flex items-start justify-center pt-4 lg:pt-8">
                      {item.title}
                    </p>
                    {/* <span className="text-xs font-light text-foreground lowercase tracking-[0.2rem]">
                    {item.type}
                  </span> */}
                  </figcaption>
                </figure>
              </Link>
            );
          })}
        </div>
      </Section>
    </Container>
  );
}

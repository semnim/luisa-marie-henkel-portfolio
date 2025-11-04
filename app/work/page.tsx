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
  null,
  null,
  null,
  { id: 5, title: 'Fading Ties', thumbnailUrl: '/placeholders/4/2.webp' },
  null,
  null,
  null,
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
  null,
  null,
];
export default function WorkPage() {
  // container heading: bg-transparent absolute top-0 top-0 left-0 right-0 lg:pt-20 pt-8
  return (
    <Container disableScrollSnap>
      <Section className="overflow-y-scroll max-h-dvh snap-y snap-proximity pt-0 lg:pt-32">
        <Heading title="PROJECTS" containerClassName="fixed top-20 inset-x-0" />
        <div className="grid grid-cols-1 lg:grid-cols-3 relative">
          {PROJECTS.map((item, index) => {
            if (item === null) {
              return <div key={'empty' + index} />;
            }
            return (
              <Link
                href={`/work/${createSlugForWorkItem(item.title)}`}
                key={item.id}
                className={` group overflow-hidden sticky top-0 snap-start h-dvh lg:h-[calc(100dvh-192px)]`}
              >
                <figure
                  key={item.id}
                  className="flex flex-1 w-full h-full sticky top-0"
                >
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
                  />
                  <figcaption className="absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-center items-center h-full bg-radial from-transparent to-black/50">
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

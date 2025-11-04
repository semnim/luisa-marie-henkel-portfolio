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
  // null,
  // null,
  // null,
  { id: 5, title: 'Fading Ties', thumbnailUrl: '/placeholders/4/2.webp' },
  // null,
  // null,
  // null,
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
  // null,
  // null,
];
export default function WorkPage() {
  return (
    <Container disableScroll disableScrollSnap>
      <Heading
        title="PROJECTS"
        containerClassName="fixed top-8 lg:top-32 inset-x-0"
      />
      <Section className="overflow-y-scroll max-h-dvh snap-y snap-mandatory lg:pt-64 lg:overflow-y-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 relative lg:overflow-y-scroll">
          {PROJECTS.map((item, index) => {
            if (item === null) {
              return <div className="h-0" key={'empty' + index} />;
            }
            return (
              <Link
                href={`/work/${createSlugForWorkItem(item.title)}`}
                key={item.id}
                className={` group overflow-hidden snap-center relative h-dvh lg:h-[500px]`}
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
                  <figcaption className="backdrop-brightness-75 absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-center items-center h-full">
                    <Heading variant="ITEM" title={item.title} />
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

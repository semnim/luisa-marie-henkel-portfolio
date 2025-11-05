import { createSlugFromProjectTitle } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Heading } from '../heading';

const PLACEHOLDER_IMAGES = [
  {
    src: '/placeholders/1/1.webp',
    title: 'Been Down For So Long',
    type: 'EDITORIAL',
  },
  {
    src: '/placeholders/2/1.webp',
    title: 'Lonely At The Top',
    type: 'COMMERCIAL',
  },
  {
    src: '/placeholders/3/1.webp',
    title: 'Madame Rêve',
    type: 'EDITORIAL',
  },
  {
    src: '/placeholders/4/1.webp',
    title: 'Fading Ties',
    type: 'COMMERCIAL',
  },
];

export const FeaturedShowcase = () => {
  return (
    <div className="max-w-screen min-h-0 flex flex-col lg:flex-row flex-1 py-8">
      {PLACEHOLDER_IMAGES.map((item, index) => (
        <Link
          className={`group relative overflow-hidden aspect-square flex flex-1 lg:max-h-full`}
          key={index}
          href={`/work/${createSlugFromProjectTitle(item.title)}`}
        >
          <figure className="flex flex-1">
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
            />
            <figcaption className="absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-start items-center h-50 bg-linear-to-b from-black/75 to-transparent mb-auto">
              <Heading
                variant="ITEM"
                title={item.title}
                subtitle={item.type}
                containerClassName="pt-4 lg:pt-8 "
              />
            </figcaption>
          </figure>
        </Link>
      ))}
    </div>
  );
};

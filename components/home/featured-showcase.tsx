import { createSlugForWorkItem } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const PLACEHOLDER_IMAGES = [
  {
    src: '/placeholders/1/1.jpg',
    title: 'Been Down For So Long',
    type: 'EDITORIAL',
  },
  {
    src: '/placeholders/2/1.JPG',
    title: 'Lonely At The Top',
    type: 'COMMERCIAL',
  },
  {
    src: '/placeholders/3/1.JPG',
    title: 'Madame Rêve',
    type: 'EDITORIAL',
  },
  {
    src: '/placeholders/4/1.JPG',
    title: 'Fading Ties',
    type: 'COMMERCIAL',
  },
];

export const FeaturedShowcase = () => {
  return (
    <div className="max-w-screen min-h-0 flex flex-col lg:flex-row flex-1 px-4 sm:px-8 md:px-16 lg:px-16 py-8">
      {PLACEHOLDER_IMAGES.map((item, index) => (
        <Link
          className={`group relative overflow-hidden aspect-square flex flex-1 lg:max-h-full ${
            index === 0
              ? 'rounded-t-sm  lg:rounded-tr-none lg:rounded-s-sm'
              : index === PLACEHOLDER_IMAGES.length - 1
              ? 'rounded-b-sm lg:rounded-e-sm lg:rounded-bl-none'
              : ''
          }`}
          key={index}
          href={`/work/${createSlugForWorkItem(item.title)}`}
        >
          <figure className="flex flex-1">
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover object-center group-hover:scale-110 transition-all group-hover:brightness-75"
            />
            <figcaption className="absolute inset-0 lg:hidden flex lg:group-hover:flex flex-col justify-start items-center h-50 bg-linear-to-b from-black/75 to-transparent mb-auto">
              <p className="font-bold text-xl w-full px-4 text-center flex items-start justify-center pt-4 lg:pt-8">
                {item.title}
              </p>
              <span className="text-xs font-light text-foreground lowercase tracking-[0.2rem]">
                {item.type}
              </span>
            </figcaption>
          </figure>
        </Link>
      ))}
    </div>
  );
};

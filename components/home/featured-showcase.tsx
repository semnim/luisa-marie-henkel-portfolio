'use client';

import { Heading } from '@/components/heading';
import { Image } from '@/components/image';
import { createSlugFromProjectTitle } from '@/lib/utils';
import Link from 'next/link';

const FEATURED_IMAGES = [
  {
    publicId: '5_qtexvy',
    title: 'fading ties',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_iw3lif',
    title: 'party',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_sgkqnb',
    title: 'mythical creature',
    type: 'EDITORIAL',
  },
  {
    publicId: 'thumbnail_candidate_1_qejy52',
    title: 'tangled manners',
    type: 'EDITORIAL',
  },
];

export const FeaturedShowcase = () => {
  return (
    <div className="max-w-screen min-h-0 flex flex-col lg:flex-row flex-1 py-8">
      {FEATURED_IMAGES.map((item, index) => (
        <Link
          className={`group relative overflow-hidden aspect-square flex flex-1 lg:max-h-full`}
          key={index}
          href={`/work/${createSlugFromProjectTitle(item.title)}`}
        >
          <figure className="flex flex-1">
            <Image
              src={item.publicId}
              alt={item.title}
              fill
              className="object-cover object-[0%_10%] md:object-[0%_10%] lg:object-[50%_20%] xl:object-center group-hover:scale-110 transition-all group-hover:brightness-75"
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

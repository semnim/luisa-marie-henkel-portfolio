'use client';

import { Heading } from '@/components/heading';
import { Image } from '@/components/image';

type HeroSectionProps = {
  heroImage: {
    publicId: string;
    alt: string;
  };
  title: string;
  client: string | null;
  category: 'editorial' | 'commercial';
  publishedAt: Date;
};

export function HeroSection({
  heroImage,
  title,
  client,
  category,
  publishedAt,
}: HeroSectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <section className="relative h-dvh md:h-[70vh] w-full snap-center">
      <figure className="relative w-full h-full">
        <Image
          src={heroImage.publicId}
          alt={heroImage.alt}
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/40 to-transparent">
          <div className="mx-auto h-full flex flex-col justify-end">
            <Heading
              title={title}
              containerClassName="pb-16 md:pb-8 bg-linear-to-t from-black/75 via black/40 to-transparent"
              context={
                <div className="flex flex-wrap gap-2 md:gap-4 items-center text-white/80 justify-center md:justify-start text-sm mb-4 md:mb-0">
                  <span className="uppercase tracking-wide">{category}</span>
                  {client && (
                    <>
                      <span>·</span>
                      <span>{client}</span>
                    </>
                  )}
                  <span>·</span>
                  <time dateTime={publishedAt.toISOString()}>
                    {formatDate(publishedAt)}
                  </time>
                </div>
              }
              variant="HERO"
            />
          </div>
        </div>
      </figure>
    </section>
  );
}

'use client';

import { Heading } from '@/components/heading';
import { Image } from '@/components/image';
import { ProjectMetadata } from './project-metadata';

type HeroSectionProps = {
  heroImage: {
    publicId: string;
    alt: string;
  };
  title: string;
  client: string | null;
  category: 'editorial' | 'commercial';
  description: string;
  publishedAt: Date;
};

export function HeroSection({
  heroImage,
  title,
  client,
  category,
  publishedAt,
  description,
}: HeroSectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <section className="relative h-[200dvh] md:h-dvh  w-full flex flex-col snap-start bg-linear-to-b from-black to-background">
      <figure className="relative h-dvh max-h-dvh md:max-h-auto w-full flex-4">
        <Image
          src={heroImage.publicId}
          alt={heroImage.alt}
          fill
          preload
          className="object-cover object-top"
        />
        <div className="absolute inset-0">
          <div className="mx-auto h-full flex flex-col justify-end">
            <Heading
              title={title}
              containerClassName="pb-16 md:pb-8 bg-linear-to-t from-black via-black/75 via-75% via-black/40 via-50% to-transparent"
              context={
                <div className="flex flex-wrap gap-2 md:gap-4 items-center text-white/80 justify-center md:justify-start text-xs md:text-sm mb-4 md:mb-0">
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
              variant="SECTION"
            />
          </div>
        </div>
      </figure>
      <ProjectMetadata description={description} category={category} />
    </section>
  );
}

'use client';

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
    <section className="relative h-[200dvh] md:h-dvh w-full flex flex-col">
      <div className="overflow-hidden snap-start">
        <figure className="relative h-dvh md:max-h-[calc(100dvh-60px)] max-h-[calc(100dvh-60px)] w-full flex-4 overflow-hidden z-0">
          <Image
            src={heroImage.publicId}
            alt={heroImage.alt}
            fill
            preload
            className="object-cover object-top z-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background to-transparent to-10% md:from-5% md:to-30%">
            <div className="mx-auto h-full flex flex-col justify-end">
              <div
                className={
                  'relative z-10 text-center flex flex-col items-center justify-center pb-4 md:pb-24'
                }
              >
                <h1
                  className={
                    'text-3xl text-center font-light tracking-hero-heading uppercase'
                  }
                >
                  {title}
                </h1>
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
              </div>
            </div>
          </div>
        </figure>
      </div>
      <ProjectMetadata description={description} category={category} />
    </section>
  );
}

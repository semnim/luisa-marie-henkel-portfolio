'use client';

import { Image } from '@/components/image';
import { formatDate } from '@/lib/utils';

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
  return (
    <section className="relative h-dvh md:h-[calc(100dvh-300px)] w-full flex flex-col snap-start">
      <figure className="relative h-dvh w-full flex-4 overflow-hidden z-0">
        <div className="absolute inset-0 bg-linear-to-b from-background via-15% via-black/20 to-transparent z-10" />
        <Image
          src={heroImage.publicId}
          alt={heroImage.alt}
          fill
          preload
          className="object-cover object-top z-0"
        />
        <div className="absolute inset-0 gradient-easing border-b border-background">
          <div className="mx-auto h-full flex flex-col justify-end">
            <div
              className={
                'relative z-10 text-center flex flex-col items-center justify-center pb-4 md:pb-36'
              }
            >
              <h1
                className={
                  'text-3xl text-center font-light tracking-hero-heading uppercase'
                }
              >
                {title}
              </h1>
              <div className="flex flex-wrap gap-2 md:gap-4 items-center text-white/80 justify-center md:justify-start text-xs mb-4 md:mb-0 mt-2">
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
    </section>
  );
}

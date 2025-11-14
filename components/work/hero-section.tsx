'use client';

import { formatDate } from '@/lib/utils';
import Image from 'next/image';

type HeroSectionProps = {
  desktopHeroImage: {
    url: string;
    alt: string;
  };
  mobileHeroImage: {
    url: string;
    alt: string;
  };
  title: string;
  client: string | null;
  category: 'editorial' | 'commercial';
  publishedAt: Date | null;
};

export function HeroSection({
  desktopHeroImage,
  mobileHeroImage,
  title,
  client,
  category,
  publishedAt,
}: HeroSectionProps) {
  return (
    <section className="relative h-dvh md:h-dvh w-full flex flex-col snap-start">
      <figure className="relative h-dvh w-full flex-4 overflow-hidden z-0">
        <div className="absolute inset-0 bg-linear-to-b from-background via-15% via-black/20 to-transparent z-10" />
        {/* Desktop Hero */}
        <Image
          unoptimized
          src={desktopHeroImage.url}
          alt={desktopHeroImage.alt}
          fill
          preload
          className="hidden md:block object-cover object-top z-0"
        />
        {/* Mobile Hero */}
        <Image
          src={mobileHeroImage.url}
          alt={mobileHeroImage.alt}
          fill
          preload
          className="block md:hidden object-cover object-top z-0"
        />
        <div className="absolute inset-0 gradient-easing border-b border-background">
          <div className="mx-auto h-full flex flex-col justify-end">
            <div
              className={
                'relative z-10 text-center flex flex-col items-center justify-center pb-4 md:h-full'
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
                <span className="tracking-wide">{category}</span>
                {client && (
                  <>
                    <span>·</span>
                    <span>{client}</span>
                  </>
                )}
                {publishedAt && (
                  <>
                    <span>·</span>
                    <time dateTime={publishedAt.toISOString()}>
                      {formatDate(publishedAt).toLowerCase()}
                    </time>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </figure>
    </section>
  );
}

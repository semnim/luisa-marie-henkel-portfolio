import { BackgroundVideo } from '@/components/background-video';
import { FeaturedShowcase } from '@/components/home/featured-showcase';
import Image from 'next/image';
import { Suspense } from 'react';
export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function Home() {
  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <section className="h-screen relative overflow-hidden snap-start">
        <Suspense
          fallback={
            <Image
              src="/assets/hero_fallback.webp"
              alt="background video fallback image for hero"
              width={5851}
            />
          }
        >
          <BackgroundVideo url="/assets/hero_bg_falls_2.mp4">
            <h1 className="text-5xl tracking-heading uppercase font-light">
              Luisa-Marie Henkel
            </h1>
            <p className="text-lg tracking-subheading text-muted-foreground uppercase font-light">
              Art Director & Stylist
            </p>
          </BackgroundVideo>
        </Suspense>
      </section>
      <section className="h-screen max-h-screen pt-16 pb-8 lg:pb-16 md:pt-24 lg:pt-32 flex flex-col snap-center">
        <h2 className="text-3xl text-center font-light tracking-subheading">
          FEATURED
        </h2>
        <FeaturedShowcase />
      </section>
    </main>
  );
}

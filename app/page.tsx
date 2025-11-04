import { BackgroundVideo } from '@/components/background-video';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { Section } from '@/components/section';
import Image from 'next/image';
import { Suspense } from 'react';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function Home() {
  return (
    <Container>
      <Section variant="HERO">
        <Suspense
          fallback={
            <Image
              src="/assets/hero_fallback.webp"
              alt="background video fallback image for hero"
              width={5851}
              height={3901}
            />
          }
        >
          <BackgroundVideo url="/assets/hero_bg_falls_2.mp4">
            <Heading
              variant="HERO"
              title="Luisa-Marie Henkel"
              subtitle="Art Director & Stylist"
              containerClassName="h-full"
            />
          </BackgroundVideo>
        </Suspense>
      </Section>
      <Section className="pt-8 pb-8 lg:pb-16 lg:pt-32">
        <Heading secondary title="FEATURED" subtitle="SELECTED PROJECTS" />
        <FeaturedShowcase />
      </Section>
    </Container>
  );
}

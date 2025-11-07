import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { Section } from '@/components/section';
import Image from 'next/image';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function Home() {
  return (
    <Container>
      <Section variant="HERO">
        {/* <Suspense
          fallback={
            <Image
              src={'/public/assets/hero_fallback.webp'}
              className="object-cover"
              fill
              alt="fallback"
            />
          }
        > */}
        <Image
          src={'/assets/hero_fallback.webp'}
          className="object-cover"
          fill
          alt="fallback"
        />
        <Heading
          variant="HERO"
          title="Luisa-Marie Henkel"
          subtitle="Art Director & Stylist"
          containerClassName="h-full"
        />
        {/* </BackgroundVideo> */}
        {/* </Suspense> */}
      </Section>
      <Section className="pt-8 md:pt-32">
        <Heading secondary title="FEATURED" />
        <FeaturedShowcase />
      </Section>
    </Container>
  );
}

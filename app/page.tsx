import { BackgroundVideo } from '@/components/background-video';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { FeaturedShowcase } from '@/components/home/featured-showcase';
import { Section } from '@/components/section';

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
        <BackgroundVideo
          url="/assets/hero_bg_falls_2.mp4"
          poster="/assets/hero_fallback.webp"
        >
          <Heading
            variant="HERO"
            title="Luisa-Marie Henkel"
            subtitle="Art Director & Stylist"
            containerClassName="h-full"
          />
        </BackgroundVideo>
        {/* </Suspense> */}
      </Section>
      <Section className="pt-8 md:pt-32">
        <Heading secondary title="FEATURED" />
        <FeaturedShowcase />
      </Section>
    </Container>
  );
}

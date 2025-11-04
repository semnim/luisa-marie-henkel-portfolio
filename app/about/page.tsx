import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';

export const metadata = {
  title: 'About | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function AboutPage() {
  return (
    <Container>
      <Section className="pt-8 pb-8 lg:pb-16 lg:pt-32">
        <Heading title="BACKGROUND" />
      </Section>
    </Container>
  );
}

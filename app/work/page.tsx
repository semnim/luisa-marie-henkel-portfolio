import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';

export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function WorkPage() {
  return (
    <Container>
      <Section>
        <Heading title="PROJECTS" />
      </Section>
    </Container>
  );
}

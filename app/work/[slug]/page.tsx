import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';
import { getWorkItemTitleFromSlug } from '@/lib/utils';

export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function DetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Container>
      <Section>
        <Heading title={decodeURI(getWorkItemTitleFromSlug(slug))} />
      </Section>
    </Container>
  );
}

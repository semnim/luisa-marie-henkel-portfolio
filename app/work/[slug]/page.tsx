import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';
import { getProjectTitleFromSlug } from '@/lib/utils';

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
      <Section className="pt-8 pb-8 lg:pb-16 lg:pt-32">
        <Heading title={decodeURI(getProjectTitleFromSlug(slug))} />
      </Section>
    </Container>
  );
}

import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';
export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

const PROJECTS = [
  { id: 1, title: 'Been Down For So Long', thumbnailUrl: '' },
  { id: 2, title: 'Tangled Manners', thumbnailUrl: '' },
  { id: 3, title: 'Madame Rêve', thumbnailUrl: '' },
  { id: 4, title: 'Brothers', thumbnailUrl: '' },
  { id: 5, title: 'Fading Ties', thumbnailUrl: '' },
  { id: 6, title: 'Pioneer to the falls', thumbnailUrl: '' },
  { id: 6, title: 'Les Nocés Funebres', thumbnailUrl: '' },
];
export default function WorkPage() {
  return (
    <Container disableScrollSnap>
      <Section>
        <Heading title="PROJECTS" />
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 py-4">
          {Array.from({ length: 15 }).map((_, index) => {
            return (
              <div
                key={index}
                className="flex-1 min-h-[300px] border bg-grey-100"
              />
            );
          })}
        </div>
      </Section>
    </Container>
  );
}

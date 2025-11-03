import { BackgroundVideo } from '@/components/background-video';
import { ContactInfoList } from '@/components/contact/contact-info-list';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';

export const metadata = {
  title: 'Contact | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function ContactPage() {
  return (
    <Container>
      <Section variant="HERO">
        <BackgroundVideo url="/assets/hero_bg_falls_2.mp4">
          <Heading
            title="REACH OUT"
            context={<ContactInfoList />}
            containerClassName="h-full"
          />
        </BackgroundVideo>
      </Section>
    </Container>
  );
}

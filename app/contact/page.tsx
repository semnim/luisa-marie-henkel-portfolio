import { BackgroundVideo } from '@/components/background-video';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Section } from '@/components/section';
import { Separator } from '@/components/ui/separator';
import { Instagram, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function ContactPage() {
  return (
    <Container>
      <Section variant="HERO">
        <BackgroundVideo url="/assets/hero_bg_falls_2.mp4">
          <Heading title="REACH OUT" context={<ContactInfo />} />
        </BackgroundVideo>
      </Section>
    </Container>
  );
}

function ContactInfo() {
  return (
    <ul className="text-lg tracking-[0.25rem] flex flex-col md:flex-row gap-4 font-light">
      <li>
        <Link
          className="flex gap-2 items-center justify-center text-muted-foreground hover:text-foreground"
          href="tel:+49 15126113117"
        >
          <Phone size={15} />
          <span>+49 15126113117</span>
        </Link>
      </li>
      <div className="hidden md:block">
        <Separator orientation="vertical" />
      </div>
      <li>
        <Link
          className="flex gap-2 items-center justify-center text-muted-foreground hover:text-foreground"
          href="mailto:luisamariehenkel@gmail.com"
        >
          <Mail size={15} />
          <span>luisamariehenkel@gmail.com</span>
        </Link>
      </li>
      <div className="hidden md:block">
        <Separator orientation="vertical" />
      </div>
      <li>
        <Link
          className="flex gap-2 items-center justify-center text-muted-foreground hover:text-foreground"
          href="https://www.instagram.com/oh_luisa/"
        >
          <Instagram size={15} />
          <span>@oh_luisa</span>
        </Link>
      </li>
    </ul>
  );
}

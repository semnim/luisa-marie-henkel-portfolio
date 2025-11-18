import { fetchAboutContent } from '@/features/about/actions';
import Image from 'next/image';

export const metadata = {
  title: 'About',
  description:
    'Fashion art director and stylist with expertise in haute couture design, commercial campaigns, premium brands, and editorial work.',
};

const Paragraph = ({ text }: { text: string }) => {
  return (
    <p className="text-xs md:text-lg text-justify font-light leading-relaxed text-foreground/90">
      {text}
    </p>
  );
};

export default async function AboutPage() {
  const { paragraphs } = await fetchAboutContent();
  return (
    <main className="overscroll-none">
      <section className="mt-15 snap-start flex items-center justify-center px-6 h-full">
        <div className="max-w-xl w-full my-auto">
          <div className="space-y-8 text-center max-w-xl mx-auto mt-4">
            <Image
              src="/assets/about_me_desktop.jpeg"
              height={1066}
              width={1600}
              className="object-contain object-center rounded-xs mx-auto hidden md:block"
              alt="about image"
            />
            <Image
              src="/assets/about_me_mobile.jpeg"
              height={1002}
              width={911}
              className="object-contain object-center rounded-xs mx-auto md:hidden"
              alt="about image"
            />
            <div className="space-y-3">
              {paragraphs.map((p, index) => (
                <Paragraph key={index} text={p} />
              ))}
            </div>

            <div className="hidden md:block border-t border-white/10 pt-8 mt-12 mb-6">
              <p className="text-xs font-light uppercase tracking-item-subheading text-muted-foreground/70">
                Art Director & Stylist
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

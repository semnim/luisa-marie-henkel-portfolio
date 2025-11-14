import Image from 'next/image';

export const metadata = {
  title: 'About',
  description: 'Art director & Stylist portfolio',
};

export default function AboutPage() {
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
              <p className="text-xs md:text-lg text-justify font-light leading-relaxed text-foreground/90">
                Luisa-Marie Henkel is an Art Director and Stylist based in
                Berlin. Most recently at Wiethe Content, she led premium
                e-commerce productions for clients including Adidas and Zalando,
                creating visual content that bridges editorial aesthetics with
                commercial needs.
              </p>

              <p className="text-xs md:text-lg text-justify font-light leading-relaxed text-foreground/90">
                Her background spans haute couture ateliers in Paris—where she
                trained in pattern-making and draping alongside names like
                Margiela and Dior—to fashion styling for both editorial projects
                and brand campaigns. This foundation in garment construction
                informs her approach to styling, bringing technical
                understanding to how clothes move, fit, and photograph.
              </p>

              <p className="text-xs md:text-lg text-justify font-light leading-relaxed text-foreground/90">
                She&apos;s worked across the fashion industry&apos;s various
                touchpoints: from directing model shoots and bust styling at
                Breuninger, to organizing exhibitions as Gallery Manager at
                Sobering Galerie in Paris. Whether it&apos;s a fashion
                editorial, a product campaign, or e-commerce content, she
                approaches each project with attention to detail and an eye for
                creating images that feel considered, not contrived.
              </p>
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

import Image from 'next/image';

export const metadata = {
  title: 'About | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function AboutPage() {
  return (
    <main className="snap-y snap-mandatory h-dvh max-h-[calc(100dvh-60px)]">
      <section className="mt-15 snap-start flex items-center justify-center px-6 h-full">
        <h2 className="text-md md:text-xl w-fit mx-auto text-center font-light tracking-hero-heading z-50 h-15 fixed top-0 left-1/2 -translate-x-1/2 flex items-center">
          ABOUT
        </h2>
        <div className="max-w-xl w-full space-y-12 my-auto">
          <div className="space-y-8 text-center max-w-xl mx-auto">
            <Image
              src="/assets/about_me.jpeg"
              height={508.25}
              width={407.5}
              className="object-contain object-center rounded-xs mx-auto"
              alt="about image"
            />
            <div className="bg-accent/30 border border-white/10 rounded-sm p-8 backdrop-blur-sm">
              <p className="text-base text-justify font-light leading-relaxed text-muted-foreground">
                With a refined eye for composition and an intuitive approach to
                visual storytelling, I craft compelling narratives that
                transcend traditional boundaries. My work bridges the
                intersection of fashion, art, and culture—transforming concepts
                into immersive visual experiences that resonate with
                authenticity and intention.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-base text-justify font-light leading-relaxed text-foreground/80">
                Based between Berlin and Paris, I collaborate with
                forward-thinking brands, publications, and creative studios to
                develop distinctive visual identities. My approach emphasizes
                minimalism, texture, and the subtle interplay of light and
                form—creating work that feels both timeless and contemporary.
              </p>

              <p className="text-base text-justify font-light leading-relaxed text-foreground/80">
                Whether directing editorial campaigns, curating brand
                aesthetics, or conceptualizing spatial installations, I bring a
                meticulous attention to detail and a commitment to elevating
                every project beyond expectation. My work has been featured in
                international publications and exhibited across Europe.
              </p>
            </div>

            <div className="border-t border-white/10 pt-8 mt-12 mb-6">
              <p className="text-sm font-light uppercase tracking-item-subheading text-muted-foreground/70">
                Art Director & Stylist
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

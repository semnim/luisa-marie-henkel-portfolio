export const metadata = {
  title: 'About | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default function AboutPage() {
  return (
    <main className="md:h-screen">
      <h2 className="text-lg md:text-3xl w-fit mx-auto text-center font-light tracking-hero-heading z-50 h-15 fixed top-0 left-1/2 -translate-x-1/2 bg-background flex items-center">
        ABOUT
      </h2>
      <section className="h-dvh md:h-screen md:max-h-screen flex flex-col overflow-y-scroll md:overflow-y-hidden max-h-dvh md:snap-none md:hidden snap-mandatory snap-y"></section>
    </main>
  );
}

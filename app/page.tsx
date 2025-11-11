import { AutoRotatingCarousel } from '@/components/home/auto-rotating-carousel';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';

export const metadata = {
  title: 'Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

async function getAllProjects() {
  const allProjects = await db
    .select({
      slug: projects.slug,
      title: projects.title,
      thumbnailPublicId: projects.thumbnailPublicId,
      thumbnailUrl: projects.thumbnailUrl,
    })
    .from(projects)
    .orderBy(projects.publishedAt);
  return allProjects;
}

export default async function Home() {
  const allProjects = await getAllProjects();

  return (
    <main className="h-dvh overflow-hidden select-none touch-none overscroll-none">
      <AutoRotatingCarousel projects={allProjects} />
    </main>
  );
}

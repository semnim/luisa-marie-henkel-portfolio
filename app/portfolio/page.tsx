import { HorizontalCarousel } from '@/components/portfolio/horizontal-carousel';
import { fetchProjects } from './actions';

export const metadata = {
  title: 'Work | Luisa-Marie Henkel',
  description: 'Art director & Stylist portfolio',
};

export default async function WorkPage() {
  const projects = await fetchProjects();

  // Extract unique categories and years from projects
  const categories = ['editorial', 'commercial'];
  const years = [
    ...new Set(
      projects.map((project) => new Date(project.publishedAt).getFullYear())
    ),
  ].sort((a, b) => b - a); // Sort years descending

  return (
    <main className="h-dvh relative flex flex-col items-center justify-center">
      <HorizontalCarousel
        projects={projects}
        categories={categories}
        years={years}
      />
    </main>
  );
}

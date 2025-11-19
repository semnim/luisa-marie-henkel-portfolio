import { fetchAllProjectsWithImages } from '@/features/portfolio/actions/fetch-projects';
import { createSlugFromProjectTitle } from '@/lib/utils';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await fetchAllProjectsWithImages();

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `https://luisamariehenkel.com/portfolio/${createSlugFromProjectTitle(
      project.title
    )}`,
    lastModified: project.createdAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://luisamariehenkel.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://luisamariehenkel.com/portfolio',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://luisamariehenkel.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://luisamariehenkel.com/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    ...projectEntries,
  ];
}

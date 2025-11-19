'use server';

import { db } from '@/lib/db';
import { images, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface ProjectListItem {
  id: number;
  slug: string;
  title: string;
  category: string;
}

export async function fetchAllProjects(): Promise<ProjectListItem[]> {
  try {
    const allProjects = await db.query.projects.findMany({
      columns: {
        id: true,
        slug: true,
        title: true,
        category: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return allProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchAllProjectsWithImages() {
  try {
    const projectsWithImages = await db.query.projects.findMany({
      with: { images: true },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return projectsWithImages;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchProjectData(projectSlug: string) {
  try {
    return await db.query.projects.findFirst({
      where: eq(projects.slug, projectSlug),
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    throw error;
  }
}

export async function fetchProjectImages(projectSlug: string) {
  try {
    return await db
      .select()
      .from(images)
      .where(eq(images.projectSlug, projectSlug));
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

'use server';

import { db } from '@/lib/db';

export interface ProjectListItem {
  id: number;
  slug: string;
  title: string;
  category: string;
}

export async function fetchAllProjects(): Promise<ProjectListItem[]> {
  try {
    const projects = await db.query.projects.findMany({
      columns: {
        id: true,
        slug: true,
        title: true,
        category: true,
      },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function fetchAllProjectsWithImages() {
  try {
    const projects = await db.query.projects.findMany({
      with: { images: true },
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });

    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

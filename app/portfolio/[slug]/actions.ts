'use server';

import { db } from '@/lib/db';
import { images, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export const fetchProjectImages = async (projectSlug: string) => {
  try {
    return await db
      .select()
      .from(images)
      .where(eq(images.projectSlug, projectSlug));
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const fetchProjectData = async (projectSlug: string) => {
  try {
    return await db.query.projects.findFirst({
      where: eq(projects.slug, projectSlug),
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    throw error;
  }
};

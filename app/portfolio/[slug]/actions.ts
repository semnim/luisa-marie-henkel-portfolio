'use server';

import { db } from '@/lib/db';
import { projectImages, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { toast } from 'sonner';

export const fetchProjectImages = async (projectSlug: string) => {
  try {
    return await db
      .select()
      .from(projectImages)
      .where(eq(projectImages.projectSlug, projectSlug));
  } catch (error) {
    console.error('Error fetching images for project:', error);
    toast.error('An error occurred.');
    return [];
  }
};

export const fetchProjectData = async (projectSlug: string) => {
  try {
    return await db.query.projects.findFirst({
      where: eq(projects.slug, projectSlug),
    });
  } catch (error) {
    console.error('Error fetching project data:', error);
    toast.error('An error occurred.');
    return undefined;
  }
};

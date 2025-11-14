'use server';

import { db } from '@/lib/db';
import { images, projects, type Image } from '@/lib/schema';
import { eq } from 'drizzle-orm';

interface FeaturedProject {
  projectSlug: string;
  projectTitle: string;
  position: number;
  images: {
    desktop?: Image;
    mobile?: Image;
    both?: Image;
  };
}

interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Fetch all featured projects with their images
 */
export async function fetchFeaturedProjects(): Promise<
  ActionResult<FeaturedProject[]>
> {
  try {
    // Query: Get all featured images with their project info
    const featuredImages = await db
      .select({
        image: images,
        project: projects,
      })
      .from(images)
      .leftJoin(projects, eq(images.projectSlug, projects.slug))
      .where(eq(images.imageType, 'featured'));

    // Group by project slug and position
    const projectsMap = new Map<string, FeaturedProject>();

    for (const row of featuredImages) {
      if (!row.project) continue;

      const key = `${row.project.slug}-${row.image.position}`;

      if (!projectsMap.has(key)) {
        projectsMap.set(key, {
          projectSlug: row.project.slug,
          projectTitle: row.project.title,
          position: row.image.position || 0,
          images: {},
        });
      }

      const project = projectsMap.get(key)!;

      if (row.image.variant === 'desktop') {
        project.images.desktop = row.image;
      } else if (row.image.variant === 'mobile') {
        project.images.mobile = row.image;
      } else if (row.image.variant === 'both') {
        project.images.both = row.image;
      }
    }

    // Convert to array and sort by position
    const result = Array.from(projectsMap.values()).sort(
      (a, b) => a.position - b.position
    );

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    return {
      success: false,
      error: 'Failed to fetch featured projects',
    };
  }
}

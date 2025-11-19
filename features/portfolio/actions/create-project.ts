'use server';

import { db } from '@/lib/db';
import { NewProject, Project, projects } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface ProjectFormData {
  title: string;
  slug: string;
  category: string;
  description: string;
  client: string;
  publishedAt: string;
  team: Array<{ role: string; name: string }>;
}

export interface ActionResult {
  success: boolean;
  errors?: Array<{ field: string; message: string }>;
  project?: Project;
}

function validateProjectData(
  data: ProjectFormData
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  const validCategories = ['editorial', 'commercial'];
  if (!validCategories.includes(data.category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  if (data.team && data.team.length > 0) {
    data.team.forEach((member, index) => {
      if (!member.role || member.role.trim().length === 0) {
        errors.push({
          field: `team.${index}.role`,
          message: 'Role is required for team members',
        });
      }
      if (!member.name || member.name.trim().length === 0) {
        errors.push({
          field: `team.${index}.name`,
          message: 'Name is required for team members',
        });
      }
    });
  }

  if (data.publishedAt && data.publishedAt.length > 0) {
    const date = new Date(data.publishedAt);
    if (isNaN(date.getTime())) {
      errors.push({
        field: 'publishedAt',
        message: 'Invalid date format',
      });
    }
  }

  return errors;
}

export async function createProject(
  data: ProjectFormData
): Promise<ActionResult> {
  try {
    const validationErrors = validateProjectData(data);
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.slug, data.slug),
    });

    if (existingProject) {
      return {
        success: false,
        errors: [
          {
            field: 'title',
            message: 'A project with this title already exists',
          },
        ],
      };
    }

    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;

    const newProject: NewProject = {
      title: data.title.trim(),
      slug: data.slug,
      category: data.category as 'editorial' | 'commercial',
      description: data.description.trim() || null,
      client: data.client.trim() || null,
      publishedAt: publishedAt,
      team: data.team.length > 0 ? data.team : [],
    };

    const [created] = await db.insert(projects).values(newProject).returning();

    return { success: true, project: created };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      errors: [{ field: '_general', message: 'Failed to create project' }],
    };
  }
}

export async function updateProject(
  projectId: number,
  data: ProjectFormData
): Promise<ActionResult> {
  try {
    const validationErrors = validateProjectData(data);
    if (validationErrors.length > 0) {
      return { success: false, errors: validationErrors };
    }

    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!existingProject) {
      return {
        success: false,
        errors: [{ field: '_general', message: 'Project not found' }],
      };
    }

    const conflictingProject = await db.query.projects.findFirst({
      where: eq(projects.slug, data.slug),
    });

    if (conflictingProject && conflictingProject.id !== projectId) {
      return {
        success: false,
        errors: [
          {
            field: 'title',
            message: 'A project with this title already exists',
          },
        ],
      };
    }

    const publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;

    const [updated] = await db
      .update(projects)
      .set({
        title: data.title.trim(),
        slug: data.slug,
        category: data.category as 'editorial' | 'commercial',
        description: data.description.trim() || null,
        client: data.client.trim() || null,
        publishedAt: publishedAt,
        team: data.team.length > 0 ? data.team : [],
      })
      .where(eq(projects.id, projectId))
      .returning();

    return { success: true, project: updated };
  } catch (error) {
    console.error('Error updating project:', error);
    return {
      success: false,
      errors: [{ field: '_general', message: 'Failed to update project' }],
    };
  }
}

export async function deleteProject(
  projectId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const existingProject = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!existingProject) {
      return {
        success: false,
        error: 'Project not found',
      };
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: 'Failed to delete project',
    };
  }
}

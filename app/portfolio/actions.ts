'use server';

import { db } from '@/lib/db';

export const fetchProjects = async () => {
  try {
    return await db.query.projects.findMany({
      with: {
        images: true,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

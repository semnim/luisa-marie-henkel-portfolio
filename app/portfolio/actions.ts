'use server';

import { db } from '@/lib/db';
import { toast } from 'sonner';

export const fetchProjects = async () => {
  try {
    return await await db.query.projects.findMany({
      with: {
        images: true,
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('An error occurred.');
    return [];
  }
};

'use server';

import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { toast } from 'sonner';

export const fetchProjects = async () => {
  try {
    return await db.select().from(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error('An error occurred.');
    return [];
  }
};

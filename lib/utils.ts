import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlugForWorkItem(title: string) {
  return title.split(' ').join('-');
}

export function getWorkItemTitleFromSlug(title: string) {
  return title.split('-').join(' ');
}

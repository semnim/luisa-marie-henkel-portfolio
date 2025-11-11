import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlugFromProjectTitle(title: string) {
  return title
    .split(' ')
    .map((item) => item.toLowerCase())
    .join('-');
}

export function getProjectTitleFromSlug(title: string) {
  return title.split('-').join(' ');
}

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date);
};

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlugFromProjectTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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

export const toPartial = (obj: object | null) => {
  if (obj === null) {
    return null;
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, val]) =>
      val === null ? [key, undefined] : [key, val]
    )
  );
};

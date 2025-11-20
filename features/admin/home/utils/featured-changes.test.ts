import { describe, it, expect } from 'vitest';
import { getProjectsToDelete } from './featured-changes';

describe('getProjectsToDelete', () => {
  it('identifies projects that were removed (in initial but not in current)', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      { id: 'project-c', title: 'Project C', slug: 'project-c' },
      { id: 'project-d', title: 'Project D', slug: 'project-d' },
    ] as const;

    const currentProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined, // project-c removed
      { id: 'project-d', title: 'Project D', slug: 'project-d' },
    ] as const;

    const result = getProjectsToDelete(initialProjects, currentProjects);

    expect(result).toEqual(['project-c']);
  });

  it('returns empty array when no projects removed', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const currentProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const result = getProjectsToDelete(initialProjects, currentProjects);

    expect(result).toEqual([]);
  });

  it('identifies multiple removed projects', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      { id: 'project-b', title: 'Project B', slug: 'project-b' },
      { id: 'project-c', title: 'Project C', slug: 'project-c' },
      { id: 'project-d', title: 'Project D', slug: 'project-d' },
    ] as const;

    const currentProjects = [
      undefined,
      undefined,
      { id: 'project-c', title: 'Project C', slug: 'project-c' },
      undefined,
    ] as const;

    const result = getProjectsToDelete(initialProjects, currentProjects);

    expect(result).toEqual(['project-a', 'project-b', 'project-d']);
  });

  it('handles project replacements (not deletions)', () => {
    const initialProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const currentProjects = [
      { id: 'project-b', title: 'Project B', slug: 'project-b' },
      undefined,
      undefined,
      undefined,
    ] as const;

    const result = getProjectsToDelete(initialProjects, currentProjects);

    expect(result).toEqual(['project-a']);
  });
});

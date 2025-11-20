import { describe, it, expect } from 'vitest';
import { getUnselectedProjects } from './filter-projects';

describe('getUnselectedProjects', () => {
  it('filters out already chosen projects from available projects', () => {
    const availableProjects = [
      { id: 1, title: 'Project A', slug: 'project-a' },
      { id: 2, title: 'Project B', slug: 'project-b' },
      { id: 3, title: 'Project C', slug: 'project-c' },
      { id: 4, title: 'Project D', slug: 'project-d' },
    ];

    const featuredProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      undefined,
      { id: 'project-c', title: 'Project C', slug: 'project-c' },
      undefined,
    ] as const;

    const result = getUnselectedProjects(availableProjects, featuredProjects);

    expect(result).toEqual([
      { id: 2, title: 'Project B', slug: 'project-b' },
      { id: 4, title: 'Project D', slug: 'project-d' },
    ]);
  });

  it('returns all projects when none are chosen', () => {
    const availableProjects = [
      { id: 1, title: 'Project A', slug: 'project-a' },
      { id: 2, title: 'Project B', slug: 'project-b' },
    ];

    const featuredProjects = [undefined, undefined, undefined, undefined] as const;

    const result = getUnselectedProjects(availableProjects, featuredProjects);

    expect(result).toEqual(availableProjects);
  });

  it('returns empty array when all projects are chosen', () => {
    const availableProjects = [
      { id: 1, title: 'Project A', slug: 'project-a' },
      { id: 2, title: 'Project B', slug: 'project-b' },
    ];

    const featuredProjects = [
      { id: 'project-a', title: 'Project A', slug: 'project-a' },
      { id: 'project-b', title: 'Project B', slug: 'project-b' },
      undefined,
      undefined,
    ] as const;

    const result = getUnselectedProjects(availableProjects, featuredProjects);

    expect(result).toEqual([]);
  });
});

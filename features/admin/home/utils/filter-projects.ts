interface AvailableProject {
  id: number;
  title: string;
  slug: string;
}

interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
}

export function getUnselectedProjects(
  availableProjects: AvailableProject[],
  featuredProjects: readonly (FeaturedProject | undefined)[]
): AvailableProject[] {
  const selectedSlugs = featuredProjects
    .filter((p): p is FeaturedProject => p !== undefined)
    .map((p) => p.slug);

  return availableProjects.filter((p) => !selectedSlugs.includes(p.slug));
}

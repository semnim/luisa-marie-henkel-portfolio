interface FeaturedProject {
  id: string;
  title: string;
  slug: string;
}

export function getProjectsToDelete(
  initialProjects: readonly (FeaturedProject | undefined)[],
  currentProjects: readonly (FeaturedProject | undefined)[]
): string[] {
  const currentSlugs = new Set(
    currentProjects
      .filter((p): p is FeaturedProject => p !== undefined)
      .map((p) => p.slug)
  );

  return initialProjects
    .filter((p): p is FeaturedProject => p !== undefined)
    .filter((p) => !currentSlugs.has(p.slug))
    .map((p) => p.slug);
}

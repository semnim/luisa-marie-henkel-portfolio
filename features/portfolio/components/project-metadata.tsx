import { Project } from '@/lib/schema';

type ProjectMetadataProps = {
  description: string | null;
  team: Project['team'];
};

export function ProjectMetadata({ description, team }: ProjectMetadataProps) {
  const hasTeam = !!team && team.length > 0;
  if (!description && !hasTeam) return null;

  return (
    // Phones: its own snap stop, only as tall as its content.
    // Desktop: overlaid on the bottom of the hero.
    <section
      aria-label="About this project"
      className="snap-start md:snap-align-none w-full px-8 pt-20 pb-10 md:pt-0 md:pb-8 md:absolute md:bottom-0 md:inset-x-0 md:max-h-[300px] md:overflow-hidden"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:items-center md:gap-5">
        {description && (
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground md:text-center">
            {description}
          </p>
        )}
        {hasTeam && (
          <div className="w-full md:w-auto">
            <h2 className="mb-4 text-xs uppercase tracking-item-subheading text-foreground/70 md:sr-only">
              Team
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-3">
              {team.map((credit, index) => (
                <div key={credit.name + index} className="flex flex-col gap-1">
                  <dt className="text-xs font-light tracking-wide text-foreground">
                    {credit.role}
                  </dt>
                  <dd className="text-xs text-muted-foreground">
                    {credit.name}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}

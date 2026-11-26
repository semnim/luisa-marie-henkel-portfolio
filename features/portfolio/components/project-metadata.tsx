import { Project } from '@/lib/schema';

type ProjectMetadataProps = {
  description: string | null;
  team: Project['team'];
};

const EYEBROW =
  'text-[11px] uppercase tracking-item-subheading text-foreground/50';

export function ProjectMetadata({ description, team }: ProjectMetadataProps) {
  const hasTeam = !!team && team.length > 0;
  if (!description && !hasTeam) return null;

  return (
    // Phones: a full screen of its own, text at the top and credits at the
    // bottom. Desktop: overlaid on the bottom of the hero.
    <section
      aria-label="About this project"
      className="flex min-h-lvh w-full snap-start flex-col px-6 pt-20 pb-14 md:absolute md:inset-x-0 md:bottom-0 md:block md:max-h-[300px] md:min-h-0 md:snap-align-none md:overflow-hidden md:px-8 md:pt-0 md:pb-8"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-between gap-8 md:items-center md:justify-start md:gap-5">
        {description && (
          <div>
            <h2 className={`${EYEBROW} mb-5 md:sr-only`}>About</h2>
            <p className="max-w-prose text-lg leading-relaxed font-light text-foreground/90 md:text-center md:text-sm md:font-normal md:text-muted-foreground">
              {description}
            </p>
          </div>
        )}
        {hasTeam && (
          <div className="w-full md:w-auto">
            <h2 className={`${EYEBROW} mb-4 md:sr-only`}>Credits</h2>
            <dl className="border-b border-foreground/15 md:flex md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-3 md:border-0">
              {team.map((credit, index) => (
                <div
                  key={credit.name + index}
                  className="flex items-baseline justify-between gap-6 border-t border-foreground/15 py-2.5 md:flex-col md:items-start md:justify-start md:gap-1 md:border-0 md:py-0"
                >
                  <dt className="text-[11px] tracking-item-subheading text-foreground/60 uppercase md:text-xs md:font-light md:tracking-wide md:text-foreground md:normal-case">
                    {credit.role}
                  </dt>
                  <dd className="text-right text-sm md:text-left md:text-xs md:text-muted-foreground">
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

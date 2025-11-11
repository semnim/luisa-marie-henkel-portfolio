import { Project } from '@/lib/schema';
import React from 'react';

type ProjectMetadataProps = {
  description: string | null;
  category: 'editorial' | 'commercial';
  team: Project['team'];
};

type CreditItemProps = {
  label: string;
  value: string | string[];
};

function CreditItem({ label, value }: CreditItemProps) {
  return (
    <div className="flex flex-col gap-1 lg:my-0 my-auto">
      <dt className="text-xs md:text-md text-left tracking-wide text-foreground font-light">
        {label}
      </dt>
      <dd className="text-left text-xs md:text-md text-muted-foreground">
        {Array.isArray(value) ? value.join(', ') : value}
      </dd>
    </div>
  );
}

export function ProjectMetadata({
  description,
  category,
  team,
}: ProjectMetadataProps) {
  // Placeholder credits - will be replaced with DB data later

  return (
    <section className="snap-start px-8 md:pb-8 flex-1 h-dvh max-h-dvh md:h-[300px] md:max-h-[300px] overflow-hidden w-full lg:flex-1 flex flex-col md:snap-align-none">
      <div className="mx-auto px-4 flex flex-col justify-center flex-1 gap-4 md:container">
        {description && (
          <div className="mb-4 pt-8 md:pt-0">
            <h2 className="md:hidden mb-3 text-lg md:text-2xl tracking-wide">
              BACKGROUND
            </h2>
            <p className="leading-relaxed text-justify md:text-center md:mx-auto text-xs md:text-md md:max-w-[1000px] text-muted-foreground">
              {description}
            </p>
          </div>
        )}
        <div className="md:max-h-fit">
          {/* Credits Grid */}
          <h2 className="md:hidden mb-3 text-lg md:text-2xl tracking-wide">
            TEAM
          </h2>
          {team && (
            <div className="h-fit flex items-start max-h-fit">
              <dl className="flex-1 max-h-fit flex flex-col md:flex-row  md:justify-between md:items-start gap-1 md:gap-4 h-full mx-auto">
                {team.map((credit, index) => (
                  <React.Fragment key={credit.name}>
                    <CreditItem
                      label={
                        credit.role.replaceAll('_', ' ')[0].toUpperCase() +
                        credit.role.replaceAll('_', ' ').slice(1)
                      }
                      value={credit.name}
                    />
                    {index !== team.length - 1 && (
                      <hr className={`md:hidden w-full mr-auto`} />
                    )}
                  </React.Fragment>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

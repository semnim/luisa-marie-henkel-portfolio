'use client';
import { Project } from '@/lib/schema';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';

type ProjectMetadataProps = {
  description: string | null;
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

export function ProjectMetadata({ description, team }: ProjectMetadataProps) {
  // Placeholder credits - will be replaced with DB data later
  const [selectedTab, setSelectedTab] = useState<'description' | 'team'>(
    description ? 'description' : 'team'
  );
  return (
    <section className="snap-start px-8 md:pb-8 flex-1 h-dvh max-h-dvh pt-15 md:h-fit md:absolute md:bottom-0 md:max-h-[300px] overflow-hidden w-full lg:flex-1 flex flex-col md:snap-align-none">
      <div className="md:hidden mb-4 flex-1 flex flex-col">
        <div className="flex gap-2">
          {description && (
            <button
              type="button"
              aria-pressed={selectedTab === 'description'}
              onClick={() => setSelectedTab('description')}
              className={`mb-3 text-lg md:text-2xl tracking-wide cursor-pointer ${
                selectedTab === 'description'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              DESCRIPTION
            </button>
          )}
          {team && description && (
            <span
              aria-hidden
              className="mb-3 text-lg md:text-2xl tracking-wide text-white/75"
            >
              /
            </span>
          )}
          {team && (
            <button
              type="button"
              aria-pressed={selectedTab === 'team'}
              onClick={() => setSelectedTab('team')}
              className={`mb-3 text-lg md:text-2xl tracking-wide cursor-pointer ${
                selectedTab === 'team'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              TEAM
            </button>
          )}
        </div>
        {selectedTab === 'description' && (
          <p className="leading-relaxed text-justify md:text-center md:mx-auto text-xs md:text-md md:max-w-[1000px] text-muted-foreground">
            {description && description.length > 0 ? description : '-'}
          </p>
        )}
        {selectedTab === 'team' && team && (
          <div className="flex items-start flex-1 justify-start mt-4 flex-col">
            <dl className="flex-1 w-full max-h-fit flex flex-col md:flex-row  md:justify-between md:items-start gap-1 md:gap-4 h-full mx-auto">
              {team.map((credit, index) => (
                <React.Fragment key={credit.name + index}>
                  <CreditItem label={credit.role} value={credit.name} />
                  {index !== team.length - 1 && (
                    <Separator className="md:hidden" />
                  )}
                </React.Fragment>
              ))}
            </dl>
          </div>
        )}
      </div>
      <div className="hidden md:flex mx-auto px-4 flex-col justify-center flex-1 gap-4 md:container">
        {description && (
          <div className="mb-4 md:pt-0 ">
            <h2 className="md:hidden mb-3 text-lg md:text-2xl tracking-wide">
              DESCRIPTION
            </h2>
            <p className="leading-relaxed text-justify mx-auto text-xs text-md max-w-fit text-muted-foreground">
              {description}
            </p>
          </div>
        )}
        <div className="max-h-fit max-w-fit mx-auto">
          {/* Credits Grid */}
          <h2 className="md:hidden mb-3 text-lg md:text-2xl tracking-wide">
            TEAM
          </h2>
          {team && (
            <div className="h-fit flex items-start max-h-fit">
              <dl className="flex-1 max-h-fit flex flex-col md:flex-row  md:justify-between md:items-start gap-1 md:gap-4 h-full mx-auto">
                {team.map((credit, index) => (
                  <React.Fragment key={credit.name + index}>
                    <CreditItem label={credit.role} value={credit.name} />
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

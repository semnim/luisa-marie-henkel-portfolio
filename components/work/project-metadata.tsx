import React from 'react';

type ProjectMetadataProps = {
  description: string | null;
  category: 'editorial' | 'commercial';
};

type CreditItemProps = {
  label: string;
  value: string | string[];
};

function CreditItem({ label, value }: CreditItemProps) {
  return (
    <div className="flex flex-col gap-1 lg:my-0 my-auto">
      <dt className="text-sm md:text-md text-left tracking-wide text-foreground font-light">
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
}: ProjectMetadataProps) {
  // Placeholder credits - will be replaced with DB data later
  const credits = [
    { label: 'Photography', value: 'Ravishankar Arunasalam' },
    { label: 'Styling', value: 'Luisa-Marie Henkel' },
    { label: 'Models', value: ['Model 1', 'Model 2'] },
    { label: 'Hair', value: 'Stylist X' },
    { label: 'Make-up', value: 'Stylist Y' },
    { label: 'Location', value: 'Berlin' },
    {
      label: 'Category',
      value: category.charAt(0).toUpperCase() + category.slice(1),
    },
  ];

  return (
    <div className="p-8 flex-1 max-h-[calc(100dvh-60px)] md:h-auto w-full lg:flex-1 flex flex-col snap-start md:snap-align-none md:max-h-fit">
      <div className="mx-auto px-4 flex flex-col justify-around flex-1 gap-4">
        {description && (
          <div className="mb-4">
            <h2 className="md:hidden mb-3 text-2xl tracking-wide">
              BACKGROUND
            </h2>
            <p className="leading-relaxed text-justify text-md md:text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        )}
        <div className="md:max-h-fit">
          {/* Credits Grid */}
          <h2 className="md:hidden mb-3 text-2xl tracking-wide">TEAM</h2>
          <div className="h-fit flex items-start max-h-fit">
            <dl className="flex-1 max-h-fit flex flex-col md:flex-row  md:justify-between md:items-start gap-1 md:gap-4 h-full mx-auto">
              {credits.map((credit, index) => (
                <React.Fragment key={credit.label}>
                  <CreditItem label={credit.label} value={credit.value} />
                  {index !== credits.length - 1 && (
                    <hr className={`md:hidden w-full mr-auto`} />
                  )}
                </React.Fragment>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-1 my-auto">
      <dt className="text-sm md:text-2xl text-left tracking-wide text-foreground font-light">
        {label}
      </dt>
      {typeof value === 'string' && (
        <dd className="text-left text-xs md:text-lg text-muted-foreground">
          {value}
        </dd>
      )}
      {Array.isArray(value) && (
        <dd className="text-sm text-left text-md md:text-lg text-muted-foreground">
          <ul>
            {value.map((val) => (
              <li key={val}>{val}</li>
            ))}
          </ul>
        </dd>
      )}
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
    { label: 'Hair & Makeup', value: ['Hair stylist X', 'Makeup artist Y'] },
    { label: 'Location', value: 'Berlin' },
    {
      label: 'Category',
      value: category.charAt(0).toUpperCase() + category.slice(1),
    },
  ];

  // Placeholder narrative - will be replaced with DB data later
  const narrative =
    'This editorial shoot explores the intersection of contemporary fashion and artistic expression. Through carefully curated styling and dynamic compositions, we sought to create a visual narrative that challenges conventional perspectives and celebrates individual creativity. Each image tells a story of transformation and self-discovery, capturing moments of raw emotion and refined elegance.';

  return (
    <section className="p-8 lg:p-32 w-full snap-center md:snap-proximity min-h-dvh flex flex-col">
      <h2 className="text-3xl md:text-4xl text-center font-light tracking-wide">
        ABOUT THIS PROJECT
      </h2>
      <div className="mx-auto mt-8 px-4 max-w-2xl flex flex-col flex-1 gap-8">
        {description && (
          <p className="leading-relaxed text-justify text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
        {/* Credits Grid */}
        <div className="my-auto flex-1 flex items-start">
          <dl className="flex-1 flex flex-col gap-1 md:gap-4 h-full mx-auto">
            {credits.map((credit, index) => (
              <React.Fragment key={credit.label}>
                <CreditItem label={credit.label} value={credit.value} />
                {index !== credits.length - 1 && (
                  <hr className={`w-full mr-auto`} />
                )}
              </React.Fragment>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

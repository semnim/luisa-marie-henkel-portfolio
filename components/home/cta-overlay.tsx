'use client';

import Link from 'next/link';

const TITLE = 'FEATURED';
const SUBTITLE = 'A CURATED SELECTION';
const LINK_LABEL = 'see all projects';

export const CtaOverlay = () => {
  return (
    <div className="font-light w-full pb-2 flex flex-col items-center justify-end absolute bg-linear-to-t from-background via-75% via-black/50 to-transparent left-1/2 -translate-x-1/2 bottom-0 z-20 h-50">
      <h2 className="text-lg md:text-3xl tracking-hero-heading">{TITLE}</h2>
      <p className="text-xs mt-2 tracking-widest text-foreground font-light text-nowrap before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
        {SUBTITLE}
      </p>

      <Link
        className="mt-4 text-xs border rounded-none border-foreground/40 p-2 relative"
        href="/portfolio"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {LINK_LABEL}
      </Link>
    </div>
  );
};

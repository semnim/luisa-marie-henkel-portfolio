'use client';

import Link from 'next/link';

export const HomeCta = () => {
  return (
    <div className="font-light w-full pb-2 flex flex-col items-center justify-end absolute bg-linear-to-t from-background via-75% via-black/50 to-transparent left-1/2 -translate-x-1/2 bottom-0 z-20 h-50">
      <h2 className="text-lg md:text-3xl tracking-hero-heading">FEATURED</h2>
      <p className="text-xs mt-2 tracking-widest text-foreground font-light text-nowrap before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
        A CURATED SELECTION
      </p>

      <Link
        className="mt-4 text-xs border rounded-none border-foreground p-2 relative"
        href="/portfolio"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        SEE ALL PROJECTS
      </Link>
    </div>
  );
};

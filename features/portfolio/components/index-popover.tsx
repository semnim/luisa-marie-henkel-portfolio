'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Project } from '@/lib/schema';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IndexPopoverProps {
  projects: Project[];
}

const PANEL_ID = 'project-index';

export function IndexPopover({ projects }: IndexPopoverProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      <div
        id={PANEL_ID}
        inert={!open}
        className={`fixed inset-0 ${
          open ? 'left-0' : 'left-[200dvw]'
        } z-35 transition-all duration-700 overflow-hidden w-dvw backdrop-blur-md backdrop-brightness-50`}
      >
        <ScrollArea className="h-full">
          <nav
            aria-label="Project index"
            className="flex min-h-dvh flex-col items-center justify-center px-4 py-15"
          >
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="text-4xl md:text-6xl font-light py-2 hover:text-muted-foreground transition-colors"
              >
                {project.title}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={PANEL_ID}
        aria-label={open ? 'Close project index' : undefined}
        className="text-sm z-35 md:text-base font-semibold text-foreground transition-colors fixed right-8 bottom-4 cursor-pointer"
      >
        {open ? <X aria-hidden /> : 'Index'}
      </button>
    </>
  );
}

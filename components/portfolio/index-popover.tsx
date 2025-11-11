'use client';

import { Project } from '@/lib/schema';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface IndexPopoverProps {
  projects: Project[];
}

export function IndexPopover({ projects }: IndexPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`fixed inset-0 ${
        open ? 'left-0' : 'left-[200dvw]'
      } transition-all duration-700 overflow-hidden w-dvw`}
    >
      <p
        onClick={() => setOpen((prev) => !prev)}
        className="text-sm z-20 md:text-base font-semibold text-foreground transition-colors fixed right-8 bottom-4"
      >
        {open ? <X /> : 'Index'}
      </p>

      <div className="flex backdrop-blur-md backdrop-brightness-50 flex-col items-center justify-center h-full w-full px-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/portfolio/${project.slug}`}
            className="text-4xl md:text-6xl font-light py-2 hover:text-muted-foreground transition-colors"
          >
            {project.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

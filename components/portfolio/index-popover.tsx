'use client';

import { Project } from '@/lib/schema';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { useState } from 'react';

interface IndexPopoverProps {
  projects: Project[];
}

export function IndexPopover({ projects }: IndexPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="text-sm md:text-base hover:text-muted-foreground transition-colors">
        Index
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed inset-0 z-50 w-full duration-750 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full">
          <div className="flex flex-col items-center justify-center h-full overflow-y-auto px-4">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="text-4xl md:text-6xl font-light py-2 hover:text-muted-foreground transition-colors"
              >
                {project.title}
              </Link>
            ))}
          </div>

          <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <span className="text-2xl">×</span>
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

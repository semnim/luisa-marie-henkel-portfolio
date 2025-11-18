'use client';
import { Nav } from '@/components/ui/nav';
import '../globals.css';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpen = () => setMenuOpen(true);
  const handleClose = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          `md:mix-blend-difference fixed flex flex-col max-w-dvw top-0 z-40 h-15 w-full overflow-hidden transition-[height,backdrop-filter] ease-in-out duration-750 hover:backdrop-brightness-50 hover:text-foreground hover:mix-blend-normal`,
          menuOpen
            ? 'h-dvh backdrop-blur-md backdrop-brightness-25 hover:backdrop-brightness-25 mix-blend-normal'
            : ''
        )}
      >
        <Nav open={menuOpen} onOpen={handleOpen} onClose={handleClose} />
      </header>
      {children}
    </>
  );
}

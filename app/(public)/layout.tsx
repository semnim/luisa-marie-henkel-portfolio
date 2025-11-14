'use client';
import '../globals.css';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <header
        className={`md:mix-blend-difference fixed flex flex-col max-w-dvw top-0 z-40 h-15 w-full overflow-hidden transition-[height,backdrop-filter] ease-in-out duration-750 ${
          mobileMenuOpen ? 'h-dvh backdrop-blur-md backdrop-brightness-25' : ''
        }`}
      >
        <nav
          className={`w-full h-15 min-h-15 top-4 px-4 flex flex-col items-center justify-between gap-8`}
        >
          <div className="flex flex-1 w-full items-center">
            <Link
              href="/"
              className="text-foreground font-semibold mr-auto mix-blend-difference"
            >
              luisa-marie henkel
            </Link>

            {mobileMenuOpen ? (
              <Button
                variant={'ghost'}
                className="font-semibold mix-blend-difference"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                close
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                className="font-semibold mix-blend-difference"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                menu
              </Button>
            )}
          </div>
        </nav>
        <div
          className={`w-full flex min-h-0 flex-0 flex-col z-50 px-8 gap-4 mt-15`}
        >
          {routes.map((route) => (
            <Link
              key={route.id}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-5xl ${
                pathname === route.url
                  ? 'text-muted-foreground italic'
                  : 'text-foreground'
              }`}
              href={route.url}
            >
              {route.id}
            </Link>
          ))}
        </div>
      </header>
      {children}
    </>
  );
}

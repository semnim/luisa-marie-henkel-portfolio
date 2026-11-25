'use client';

import { routes } from '@/lib/routes';
import { getProjectTitleFromSlug } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

type NavProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const NAME = 'luisa-marie henkel';
const OPEN_LABEL = 'menu';
const CLOSE_LABEL = 'close';
const MENU_ID = 'site-menu';

export const Nav = ({ open, onOpen, onClose }: NavProps) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div className="w-full h-15 min-h-15 top-4 px-4 flex flex-col items-center justify-between gap-8">
        <div className="flex flex-1 w-full items-center">
          <Link
            href="/"
            className="text-foreground font-semibold mr-auto"
          >
            {NAME}
          </Link>

          <button
            type="button"
            className="font-semibold px-2 py-3 cursor-pointer"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={open ? onClose : onOpen}
          >
            {open ? CLOSE_LABEL : OPEN_LABEL}
          </button>
        </div>
      </div>
      {/* The header only clips this panel while it is closed, so `inert` keeps
          the hidden links out of the tab order and the accessibility tree. */}
      <div
        id={MENU_ID}
        inert={!open}
        className="w-full flex flex-1 flex-col z-50 px-8 gap-4 mt-15"
      >
        <nav aria-label="Main" className="flex flex-col gap-4">
          {routes.map((route) => {
            const isDetailsPage =
              pathname.startsWith('/portfolio') &&
              !pathname.endsWith('/portfolio') &&
              route.url.startsWith('/portfolio');
            const isCurrent = pathname === route.url;
            return (
              <React.Fragment key={route.id}>
                <Link
                  onClick={onClose}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`text-5xl w-fit transition-colors hover:text-foreground ${
                    isCurrent || isDetailsPage
                      ? 'text-foreground underline decoration-1 underline-offset-8'
                      : 'text-foreground/60'
                  }`}
                  href={route.url}
                >
                  {route.id}
                </Link>
                {isDetailsPage ? (
                  <div className="flex gap-2 items-center justify-start text-muted-foreground">
                    <CornerDownRight aria-hidden className="w-4 h-4" />
                    {pathname.split('/').length > 2
                      ? getProjectTitleFromSlug(pathname.split('/')[2])
                      : ''}
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </nav>
        <div className="mt-auto mb-2 text-xs text-muted-foreground text-center">
          <p>
            Made with ❤️ by&nbsp;
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/semnim"
              className="underline"
            >
              Semnim
            </Link>
          </p>
          <p>
            &copy;&nbsp;{new Date().getFullYear()}&nbsp;Luisa-Marie Henkel. All
            rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

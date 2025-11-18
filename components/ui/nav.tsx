'use client';

import { routes } from '@/lib/routes';
import { getProjectTitleFromSlug } from '@/lib/utils';
import { CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const NAME = 'luisa-marie henkel';
const OPEN_LABEL = 'menu';
const CLOSE_LABEL = 'close';

export const Nav = ({ open, onOpen, onClose }: NavProps) => {
  const pathname = usePathname();
  return (
    <>
      <nav
        className={`w-full h-15 min-h-15 top-4 px-4 flex flex-col items-center justify-between gap-8`}
      >
        <div className="flex flex-1 w-full items-center">
          <Link
            href="/"
            className="text-foreground font-semibold mr-auto mix-blend-difference"
          >
            {NAME}
          </Link>

          <button
            className="font-semibold mix-blend-difference p-2 cursor-pointer"
            onClick={open ? onClose : onOpen}
          >
            {open ? CLOSE_LABEL : OPEN_LABEL}
          </button>
        </div>
      </nav>
      <div className={`w-full flex flex-1 flex-col z-50 px-8 gap-4 mt-15`}>
        {routes.map((route) => {
          const isDetailsPage =
            pathname.startsWith('/portfolio') &&
            !pathname.endsWith('/portfolio') &&
            route.url.startsWith('/portfolio');
          return (
            <React.Fragment key={route.id}>
              <Link
                onClick={onClose}
                className={`text-5xl hover:text-foreground/85 ${
                  pathname === route.url || isDetailsPage
                    ? 'text-muted-foreground italic'
                    : 'text-foreground'
                }`}
                href={route.url}
              >
                {route.id}
              </Link>
              {isDetailsPage ? (
                <div className="flex gap-2 items-center justify-start text-muted-foreground italic">
                  <CornerDownRight className="w-4 h-4" />
                  {pathname.split('/').length > 2
                    ? getProjectTitleFromSlug(pathname.split('/')[2])
                    : ''}
                </div>
              ) : (
                ''
              )}
            </React.Fragment>
          );
        })}
        <div className="mt-auto mb-2 text-xs text-muted-foreground text-center">
          <p>
            Made with ❤️ by&nbsp;
            <Link
              target="_blank"
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

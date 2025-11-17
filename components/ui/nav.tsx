'use client';

import { routes } from '@/lib/routes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

          {open ? (
            <button
              className="font-semibold mix-blend-difference p-2"
              onClick={onClose}
            >
              {CLOSE_LABEL}
            </button>
          ) : (
            <button
              className="font-semibold mix-blend-difference p-2"
              onClick={onOpen}
            >
              {OPEN_LABEL}
            </button>
          )}
        </div>
      </nav>
      <div className={`w-full flex flex-1 flex-col z-50 px-8 gap-4 mt-15`}>
        {routes.map((route) => (
          <Link
            key={route.id}
            onClick={onClose}
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
        <div className="mt-auto mb-2 text-xs text-muted-foreground text-center">
          <p>
            Made with ❤️ by{' '}
            <Link
              target="_blank"
              href="https://github.com/semnim"
              className="underline"
            >
              Semnim
            </Link>
          </p>
          <p>
            &copy;&nbsp;{new Date().getFullYear()}&nbsp; Luisa-Marie Henkel. All
            rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

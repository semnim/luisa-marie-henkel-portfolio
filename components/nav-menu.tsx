'use client';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = {
  className?: string;
};

export const NavMenu = ({ className }: Props) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        'flex-1 max-w-md mx-auto justify-between uppercase flex',
        className
      )}
    >
      {routes.map((route) => (
        <div key={route.id} className="relative">
          <Link className={`text-foreground`} href={route.url}>
            {route.id}
          </Link>
        </div>
      ))}
    </nav>
  );
};

import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
  className?: string;
};

export const NavMenu = ({ className }: Props) => {
  return (
    <nav
      className={cn(
        'flex-1 max-w-md mx-auto justify-between uppercase flex',
        className
      )}
    >
      {routes.map((route) => (
        <Link key={route.id} className="hover:text-foreground" href={route.url}>
          {route.id}
        </Link>
      ))}
    </nav>
  );
};

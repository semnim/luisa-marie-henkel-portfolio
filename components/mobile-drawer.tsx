import { routes } from '@/lib/routes';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from './ui/drawer';

type Props = {
  triggerClassName: string;
};
export const MobileDrawer = ({ triggerClassName }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={'ghost'} size={'icon-lg'} className={triggerClassName}>
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Mobile Navigation menu</DrawerTitle>
        <nav className="flex flex-col flex-1 text-3xl gap-8 text-center py-8 uppercase">
          {routes.map((route) => (
            <Link
              key={route.id}
              className="hover:text-foreground"
              href={route.url}
            >
              {route.id}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

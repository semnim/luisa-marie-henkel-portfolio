'use client';

import { authClient } from '@/lib/auth-client';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Skeleton } from './skeleton';

const navItems = [
  { href: '/admin/home', label: 'HOME' },
  { href: '/admin/portfolio', label: 'PORTFOLIO' },
  { href: '/admin/about', label: 'ABOUT' },
];

const NavContent = ({
  pathname,
  handleClose,
}: {
  pathname: string;
  handleClose: () => void;
}) => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = authClient.useSession();
  if (error) return null;

  return (
    <>
      <div className="px-6 flex gap-2 items-center transition-colors duration-300 text-xs text-muted-foreground mb-4 mt-2 tracking-tight font-light">
        {isPending ? (
          <Skeleton className="w-45 mt-1 h-3" />
        ) : (
          <p className="text-muted-foreground font-regular border-b">
            Welcome back, <span>{session?.user.name}</span>
          </p>
        )}
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleClose}
              className={`block px-6 py-3 text-sm tracking-item-subheading font-light transition-colors duration-300 ${
                isActive
                  ? 'text-foreground border-l-2 border-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        key={'sign out'}
        onClick={() => authClient.signOut().then(() => redirect('/'))}
        className={`block cursor-pointer px-6 text-red-400 hover:text-red-600 py-3 text-sm tracking-item-subheading font-light transition-colors duration-300 text-left`}
      >
        SIGN OUT
      </button>
    </>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed bottom-3 left-3 z-50 md:hidden text-foreground bg-background rounded-full p-2"
        aria-label="Toggle menu"
      >
        {mobileOpen ? (
          <X className="w-6 h-6" strokeWidth={1} />
        ) : (
          <Menu className="w-6 h-6" strokeWidth={1} />
        )}
      </button>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-muted-foreground/20 z-40 flex flex-col transition-transform duration-500 ease-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-2 h-full flex flex-col">
          <NavContent
            pathname={pathname}
            handleClose={() => setMobileOpen(false)}
          />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-75 md:bg-background md:border-r md:border-muted-foreground/20">
        <div className="pt-2 h-full flex flex-col">
          <NavContent
            pathname={pathname}
            handleClose={() => setMobileOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}

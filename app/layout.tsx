'use client';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { routes } from '@/lib/routes';
import { Menu } from 'lucide-react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useState } from 'react';

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased flex flex-col`}>
        <header className="fixed top-0 z-40 h-15 w-full bg-background">
          <nav className="hidden md:flex h-full items-center justify-end gap-8 px-4">
            {routes.map((route) => (
              <Link
                key={route.id}
                className={`text-foreground hover:scale-110`}
                href={route.url}
              >
                {route.id}
              </Link>
            ))}
          </nav>
          <nav className="md:hidden h-full relative flex items-center justify-end gap-8 px-4">
            <Menu onClick={() => setMobileMenuOpen((prev) => !prev)} />
          </nav>
        </header>
        <div
          className={`md:hidden bg-background fixed top-15 w-full flex flex-col z-50 px-8 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'h-50 pb-4' : 'h-0 pb-0'
          }`}
        >
          <p className="text-muted-foreground">Luisa-Marie Henkel</p>
          {routes.map((route) => (
            <Link
              key={route.id}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-foreground`}
              href={route.url}
            >
              {route.id}
            </Link>
          ))}
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

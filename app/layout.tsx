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
        <header
          className={`fixed flex flex-col bg-background md:flex-row top-0 z-40 h-15 w-full ${
            mobileMenuOpen
              ? 'bg-transparent backdrop-blur-lg backdrop-brightness-75 transition-all h-70 border-b border-border'
              : 'bg-transparent'
          }`}
        >
          <nav className="hidden md:flex h-full items-center justify-end w-full gap-8 px-4 pr-8">
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
          <nav className="md:hidden absolute top-4 right-4 flex items-center justify-end gap-8">
            <Menu
              size={20}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            />
          </nav>
          <div
            className={`md:hidden fixed top-15 w-full flex flex-col z-50 px-8 gap-4 overflow-hidden transition-all duration-150 ease-in-out ${
              !mobileMenuOpen ? 'opacity-0' : 'opacity-100'
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
        </header>
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

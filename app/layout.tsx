'use client';
import { DesktopNavMenu } from '@/components/desktop-nav-menu';
import './globals.css';

import { MobileDrawer } from '@/components/mobile-drawer';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased flex flex-col`}>
        <header className="absolute inset-x-0 z-50 text-muted-foreground items-center flex justify-end px-8 py-4">
          <MobileDrawer triggerClassName="md:hidden" />
          <DesktopNavMenu className="hidden md:flex" />
        </header>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

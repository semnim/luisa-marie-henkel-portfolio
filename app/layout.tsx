'use client';
import { DesktopNavMenu } from '@/components/desktop-nav-menu';
import './globals.css';

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
        <header className="bottom-0 md:top-0 absolute inset-x-0 z-50 text-muted-foreground items-center flex justify-end px-8 md:px-8 py-4 bg-linear-to-t md:bg-linear-to-b from-black/75 to-transparent h-10 md:h-25">
          <DesktopNavMenu className="flex" />
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

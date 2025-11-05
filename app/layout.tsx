'use client';
import { NavMenu } from '@/components/nav-menu';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
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
        <header className="bottom-0 lg:top-0 fixed inset-x-0 z-50 text-muted-foreground items-center flex justify-end px-8 lg:px-8 py-4 bg-linear-to-t lg:bg-linear-to-b from-black from-0% via-black/75 via-50% to-transparent to-100% h-10 lg:h-25">
          <NavMenu />
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

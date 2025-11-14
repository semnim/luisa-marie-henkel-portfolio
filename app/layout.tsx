import './globals.css';

import { Inter } from 'next/font/google';
import React from 'react';
import { AppProvider } from './provider';

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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

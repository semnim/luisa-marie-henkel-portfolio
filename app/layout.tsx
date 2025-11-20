import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import { AppProvider } from './provider';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://luisamariehenkel.com'),
  title: {
    default: 'Luisa-Marie Henkel',
    template: 'Luisa-Marie Henkel - %s',
  },
  alternates: {
    canonical: './',
  },
  description:
    'Art director & stylist portfolio showcasing creative work in fashion, editorial, and commercial projects.',
  keywords: [
    'art director',
    'stylist',
    'fashion',
    'editorial',
    'portfolio',
    'creative direction',
    'fashion stylist',
    'commercial photography',
    'Luisa-Marie Henkel',
    'Luisa-Marie Henkel Portfolio',
    'Luisa-Marie Henkel Instagram',
    'fashion styling',
    'art direction',
    'set design',
    'visual storytelling',
  ],
  authors: [
    { name: 'Luisa-Marie Henkel', url: 'https://luisamariehenkel.com' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luisamariehenkel.com',
    siteName: 'Luisa-Marie Henkel',
    title: 'Luisa-Marie Henkel | Art Director & Stylist',
    description:
      'Art director & stylist portfolio showcasing creative work in fashion, editorial, and commercial projects.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Luisa-Marie Henkel Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luisa-Marie Henkel | Art Director & Stylist',
    description:
      'Art director & stylist portfolio showcasing creative work in fashion, editorial, and commercial projects.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased flex flex-col`}>
        <NextTopLoader color="#fafafa" showSpinner={false} />

        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

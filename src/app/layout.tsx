// src/app/layout.tsx
import * as React from 'react';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/app-providers';
import LayoutRenderer from './layout-renderer';
import type { Metadata } from 'next';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const fontMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: 'Prolter - Gerenciador mais completo do Mercado.',
  description: 'Gerenciador mais completo do Mercado.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children: pageContent,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="antialiased font-sans bg-background text-foreground" suppressHydrationWarning>
        <AppProviders>
          <LayoutRenderer>{pageContent}</LayoutRenderer>
        </AppProviders>
      </body>
    </html>
  );
}

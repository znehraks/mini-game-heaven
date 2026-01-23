import type { Metadata, Viewport } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Providers } from '@/components/providers/Providers';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-arcade',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mini-game-heaven.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mini Game Heaven',
    template: '%s | Mini Game Heaven',
  },
  description:
    'Play addictive arcade mini games and compete for the top scores! Free retro-style games with global leaderboards.',
  keywords: [
    'games',
    'arcade',
    'mini games',
    'leaderboard',
    'casual games',
    'retro games',
    'browser games',
    'free games',
    'PWA',
  ],
  authors: [{ name: 'Mini Game Heaven Team' }],
  creator: 'Mini Game Heaven',
  publisher: 'Mini Game Heaven',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mini Game Heaven',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: 'Mini Game Heaven',
    title: 'Mini Game Heaven - Retro Arcade Games',
    description:
      'Play addictive arcade mini games and compete for the top scores! Free retro-style games with global leaderboards.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mini Game Heaven - Retro Arcade Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Game Heaven - Retro Arcade Games',
    description: 'Play addictive arcade mini games and compete for the top scores!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050508',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={pressStart2P.variable}>
      <body className="antialiased min-h-screen">
        <Providers>
          <Header />
          <main className="pt-14 pb-20">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

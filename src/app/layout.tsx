import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = 'https://typing.gokgok.in';

export const viewport: Viewport = {
  themeColor: '#141419',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GokType — Minimalist Speed Typing Test & EdClub Finger Trainer',
    template: '%s | GokType',
  },
  description:
    'GokType is a sleek, minimalist speed typing test inspired by Monkeytype with authentic mechanical keyboard sound effects, live WPM analysis, and EdClub-style interactive hand and finger guides. 100% free and private.',
  applicationName: 'GokType',
  authors: [{ name: 'Sanjai Gandhi (sanjai8173)', url: 'https://github.com/sanjai8173' }],
  generator: 'Next.js',
  keywords: [
    'typing test',
    'monkeytype clone',
    'speed typing test',
    'wpm test',
    'touch typing practice',
    'edclub typing tutor',
    'typing club hands guide',
    'finger position typing trainer',
    'mechanical keyboard sounds typing',
    'holy panda typing sound',
    'goktype',
    'gokgok.in typing',
    'words per minute test',
    'free online typing practice',
    'developer typing test',
  ],
  creator: 'Sanjai Gandhi',
  publisher: 'gokgok.in',
  alternates: {
    canonical: siteUrl,
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
  openGraph: {
    title: 'GokType — Minimalist Speed Typing Test & EdClub Finger Trainer',
    description:
      'Train touch typing speed with tactile mechanical keyboard sounds, live WPM analysis, and EdClub-style finger guides. 100% client-side with LocalStorage.',
    url: siteUrl,
    siteName: 'GokType',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GokType — Minimalist Speed Typing Test & EdClub Finger Trainer',
    description:
      'Minimalist Monkeytype clone with tactile mechanical keyboard audio and interactive EdClub finger position guides.',
    creator: '@sanjai8173',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org Structured Data
  const jsonLdWebapp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'GokType',
    url: siteUrl,
    description:
      'A sleek, minimalist speed typing test featuring tactile mechanical keyboard sounds, live WPM analysis, and EdClub-style interactive hand and finger guides.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'en',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Sanjai Gandhi',
      url: 'https://github.com/sanjai8173',
    },
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is WPM calculated on GokType?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WPM is calculated using the international standard: (All Correct Keystrokes / 5) / (Elapsed Time in Minutes). One word is defined as 5 characters.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the EdClub finger position guide in GokType?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GokType displays a color-coded virtual QWERTY keyboard and animated Left and Right hands highlighting exactly which finger should hit each key for proper touch-typing ergonomics.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does GokType have mechanical keyboard sounds?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! GokType features Web Audio API sound synthesis for Holy Panda (Thock), Cherry MX Blue (Clicky), Cherry MX Brown (Tactile), vintage typewriter, and 8-bit beeps.',
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebapp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-[var(--main-color)] selection:text-[var(--bg-color)]">
        {children}
      </body>
    </html>
  );
}

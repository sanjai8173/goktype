import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'goktype — minimalistic & customizable typing test',
  description:
    'A sleek Monkeytype clone with personal branding on gok, procedural mechanical typing sound effects, and EdClub-style interactive hand and finger guides. Built by sanjai8173.',
  authors: [{ name: 'sanjai8173', url: 'https://github.com/sanjai8173' }],
  keywords: [
    'typing test',
    'monkeytype clone',
    'goktype',
    'edclub finger position',
    'typing practice',
    'mechanical keyboard sounds',
    'touch typing',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-[var(--main-color)] selection:text-[var(--bg-color)]">
        {children}
      </body>
    </html>
  );
}

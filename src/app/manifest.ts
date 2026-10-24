import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GokType — Minimalist Speed Typing Test & Trainer',
    short_name: 'GokType',
    description:
      'Train touch typing speed with tactile mechanical keyboard sounds, live WPM analysis, and EdClub-style finger guides.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141419',
    theme_color: '#f5b041',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

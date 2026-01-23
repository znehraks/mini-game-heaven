import { MetadataRoute } from 'next';
import { GAMES } from '@/config/games';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mini-game-heaven.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const gameRoutes = GAMES.map((game) => ({
    url: `${siteUrl}/games/${game.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...gameRoutes,
  ];
}

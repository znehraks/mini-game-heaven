import type { Game } from '@/types/database';

// Static game configuration for client-side rendering
// This matches the games table in the database
export const GAMES: Game[] = [
  {
    id: 'neon-tower',
    name: 'Neon Tower Stack',
    description: 'Stack blocks to build the tallest neon tower! Time your taps perfectly.',
    thumbnail: 'https://placehold.co/640x360/1a1a2e/00ffff?text=Neon+Tower',
    max_score: 999999,
    config: { difficulty: 'medium', blockSpeed: 2 },
    created_at: new Date().toISOString(),
  },
  {
    id: 'gravity-switcher',
    name: 'Gravity Switcher',
    description: 'Switch gravity to dodge obstacles! How long can you survive?',
    thumbnail: 'https://placehold.co/640x360/1a1a2e/ff00ff?text=Gravity+Switcher',
    max_score: 999999,
    config: { difficulty: 'medium', obstacleSpeed: 3 },
    created_at: new Date().toISOString(),
  },
  {
    id: 'color-rush',
    name: 'Color Rush',
    description: 'Match colors as fast as you can! Beat the clock and set a high score.',
    thumbnail: 'https://placehold.co/640x360/1a1a2e/ffff00?text=Color+Rush',
    max_score: 999999,
    config: { difficulty: 'medium', timeLimit: 60 },
    created_at: new Date().toISOString(),
  },
];

export function getGameById(id: string): Game | undefined {
  return GAMES.find((game) => game.id === id);
}

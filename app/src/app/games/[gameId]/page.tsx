import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getGameById, GAMES } from '@/config/games';
import { GameContainer } from '@/components/game/GameContainer';

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: 'Game Not Found' };
  }

  return {
    title: game.name,
    description: game.description ?? 'Play this awesome game!',
  };
}

export function generateStaticParams() {
  return GAMES.map((game) => ({
    gameId: game.id,
  }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Game Header */}
      <header className="mb-6">
        <h1 className="font-arcade text-sm text-neon-cyan mb-2">{game.name}</h1>
        <p className="text-text-secondary text-sm">{game.description}</p>
      </header>

      {/* Game Container - Will hold Phaser game */}
      <GameContainer gameId={gameId} />
    </div>
  );
}

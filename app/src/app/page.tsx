import { GameCard } from '@/components/game/GameCard';
import { GAMES } from '@/config/games';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="font-arcade text-lg text-neon-pink text-glow-pink mb-4">MINI GAME HEAVEN</h1>
        <p className="text-text-secondary max-w-md mx-auto">
          Play addictive arcade games and compete for the top scores!
        </p>
      </section>

      {/* Games Grid */}
      <section>
        <h2 className="font-arcade text-xs text-neon-cyan mb-4">SELECT GAME</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-arcade-darker flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="font-pixel text-neon-cyan text-xl mb-4">OFFLINE</h1>
        <p className="text-arcade-muted font-pixel text-xs mb-6">NO INTERNET CONNECTION</p>
        <p className="text-arcade-muted/70 text-sm max-w-xs mx-auto mb-8">
          Please check your connection and try again. Your game progress will be saved locally.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan px-6 py-3 rounded-lg font-pixel text-xs hover:bg-neon-cyan/30 transition-colors"
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}

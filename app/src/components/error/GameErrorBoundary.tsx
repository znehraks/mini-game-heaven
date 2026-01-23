'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  gameName?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GameErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GameError]', this.props.gameName || 'Unknown Game', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-arcade-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-arcade-surface border-2 border-neon-pink rounded-game p-8 text-center relative overflow-hidden">
              {/* Scanline effect */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="h-full w-full bg-gradient-to-b from-transparent via-neon-pink/20 to-transparent bg-[length:100%_4px] animate-scanline" />
              </div>

              {/* Game Over Style */}
              <div className="relative z-10">
                <div className="mb-6">
                  <h1 className="font-pixel text-2xl text-neon-pink mb-2 animate-pulse">
                    GAME CRASHED
                  </h1>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-neon-pink rounded-sm animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>

                {this.props.gameName && (
                  <p className="text-arcade-muted text-sm mb-2">{this.props.gameName}</p>
                )}

                <p className="text-white text-sm mb-6">
                  An error occurred while running the game.
                  <br />
                  Your progress may not have been saved.
                </p>

                {this.state.error && process.env.NODE_ENV === 'development' && (
                  <div className="bg-arcade-dark rounded-game p-3 mb-6 text-left">
                    <p className="font-mono text-[10px] text-neon-pink/80 break-all">
                      {this.state.error.message}
                    </p>
                    <p className="font-mono text-[8px] text-arcade-muted mt-1 break-all">
                      {this.state.error.stack?.split('\n')[1]?.trim()}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="w-full bg-neon-cyan text-arcade-dark font-pixel text-sm py-3 px-6 rounded-game hover:bg-neon-cyan/80 transition-all hover:scale-105 active:scale-95"
                  >
                    🔄 RETRY
                  </button>

                  <Link
                    href="/"
                    className="block w-full border border-neon-purple text-neon-purple font-pixel text-sm py-3 px-6 rounded-game hover:bg-neon-purple/10 transition-colors"
                  >
                    🏠 BACK TO LOBBY
                  </Link>
                </div>

                {/* Insert Coin Animation */}
                <p className="mt-6 text-arcade-muted text-xs animate-blink">
                  PRESS RETRY TO CONTINUE
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GameErrorBoundary;

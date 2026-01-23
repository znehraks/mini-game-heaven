'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-arcade-surface border border-neon-pink rounded-game p-6 text-center">
          {/* Glitch effect icon */}
          <div className="mb-4">
            <div className="inline-block relative">
              <span className="text-4xl animate-pulse">⚠️</span>
              <div className="absolute inset-0 text-4xl text-neon-pink opacity-50 animate-glitch-1">
                ⚠️
              </div>
            </div>
          </div>

          <h2 className="font-pixel text-lg text-neon-pink mb-2">SYSTEM ERROR</h2>

          <p className="text-arcade-muted text-sm mb-4">
            Something went wrong. The game encountered an unexpected error.
          </p>

          {error && process.env.NODE_ENV === 'development' && (
            <div className="bg-arcade-dark/50 rounded-game p-3 mb-4 text-left">
              <p className="font-mono text-[10px] text-neon-pink break-all">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={onReset}
              className="w-full bg-neon-cyan text-arcade-dark font-pixel text-xs py-3 px-4 rounded-game hover:bg-neon-cyan/80 transition-colors"
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full border border-arcade-muted text-arcade-muted font-pixel text-xs py-3 px-4 rounded-game hover:border-white hover:text-white transition-colors"
            >
              RELOAD PAGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;

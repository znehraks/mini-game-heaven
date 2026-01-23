import { create } from 'zustand';

interface GameState {
  // Game status
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;

  // Score
  score: number;
  highScore: number;

  // Game info
  currentGameId: string | null;
  lives: number;
  level: number;

  // Actions
  startGame: (gameId: string) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addScore: (points: number) => void;
  setScore: (score: number) => void;
  loseLife: () => void;
  nextLevel: () => void;
  reset: () => void;
}

const initialState = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  highScore: 0,
  currentGameId: null,
  lives: 3,
  level: 1,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  startGame: (gameId) =>
    set({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      currentGameId: gameId,
      lives: 3,
      level: 1,
    }),

  pauseGame: () => set({ isPaused: true }),

  resumeGame: () => set({ isPaused: false }),

  endGame: () => {
    const { score, highScore } = get();
    set({
      isPlaying: false,
      isGameOver: true,
      highScore: Math.max(score, highScore),
    });
  },

  addScore: (points) =>
    set((state) => ({
      score: state.score + points,
    })),

  setScore: (score) => set({ score }),

  loseLife: () => {
    const { lives } = get();
    if (lives <= 1) {
      get().endGame();
    } else {
      set({ lives: lives - 1 });
    }
  },

  nextLevel: () =>
    set((state) => ({
      level: state.level + 1,
    })),

  reset: () => set(initialState),
}));

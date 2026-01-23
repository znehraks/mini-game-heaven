import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface UIState {
  // Modal state
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Toast state
  toasts: Toast[];

  // Sound settings
  isSoundEnabled: boolean;
  isMusicEnabled: boolean;
  volume: number;

  // Haptic settings
  isVibrationEnabled: boolean;

  // Settings modal
  isSettingsOpen: boolean;

  // Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
  toggleVibration: () => void;
  openSettings: () => void;
  closeSettings: () => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isModalOpen: false,
  modalContent: null,
  toasts: [],
  isSoundEnabled: true,
  isMusicEnabled: true,
  volume: 0.7,
  isVibrationEnabled: true,
  isSettingsOpen: false,

  // Modal actions
  openModal: (content) =>
    set({
      isModalOpen: true,
      modalContent: content,
    }),

  closeModal: () =>
    set({
      isModalOpen: false,
      modalContent: null,
    }),

  // Toast actions
  addToast: (message, type = 'info') =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: String(++toastId),
          message,
          type,
        },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  // Sound actions
  toggleSound: () =>
    set((state) => ({
      isSoundEnabled: !state.isSoundEnabled,
    })),

  toggleMusic: () =>
    set((state) => ({
      isMusicEnabled: !state.isMusicEnabled,
    })),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

  // Vibration actions
  toggleVibration: () =>
    set((state) => ({
      isVibrationEnabled: !state.isVibrationEnabled,
    })),

  // Settings modal actions
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
}));

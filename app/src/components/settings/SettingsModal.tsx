'use client';

import { Modal } from '@/components/ui/Modal';
import { useUIStore } from '@/stores/uiStore';
import { PushNotificationToggle } from '@/components/push';

interface ToggleProps {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  icon: string;
}

function SettingsToggle({ label, description, enabled, onToggle, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <div className="font-pixel text-xs text-white">{label}</div>
          {description && <div className="text-arcade-muted text-[10px] mt-0.5">{description}</div>}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-neon-cyan' : 'bg-arcade-muted/50'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: string;
}

function SettingsSlider({ label, value, onChange, icon }: SliderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{icon}</span>
        <div className="font-pixel text-xs text-white">{label}</div>
        <div className="ml-auto font-pixel text-xs text-neon-cyan">{Math.round(value * 100)}%</div>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-arcade-muted/50 rounded-full appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-neon-cyan
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,255,0.5)]"
      />
    </div>
  );
}

export function SettingsModal() {
  const {
    isSettingsOpen,
    closeSettings,
    isSoundEnabled,
    isMusicEnabled,
    isVibrationEnabled,
    volume,
    toggleSound,
    toggleMusic,
    toggleVibration,
    setVolume,
  } = useUIStore();

  return (
    <Modal isOpen={isSettingsOpen} onClose={closeSettings} title="SETTINGS">
      <div className="divide-y divide-arcade-muted/20">
        {/* Audio Section */}
        <div className="pb-2">
          <h3 className="font-pixel text-[10px] text-neon-magenta mb-2">AUDIO</h3>
          <SettingsToggle
            label="SOUND EFFECTS"
            description="Game sounds and feedback"
            enabled={isSoundEnabled}
            onToggle={toggleSound}
            icon="🔊"
          />
          <SettingsToggle
            label="MUSIC"
            description="Background music"
            enabled={isMusicEnabled}
            onToggle={toggleMusic}
            icon="🎵"
          />
          <SettingsSlider label="VOLUME" value={volume} onChange={setVolume} icon="🎚️" />
        </div>

        {/* Haptic Section */}
        <div className="pt-4 pb-2">
          <h3 className="font-pixel text-[10px] text-neon-magenta mb-2">HAPTIC</h3>
          <SettingsToggle
            label="VIBRATION"
            description="Haptic feedback on mobile"
            enabled={isVibrationEnabled}
            onToggle={toggleVibration}
            icon="📳"
          />
        </div>

        {/* Notifications Section */}
        <div className="pt-4 pb-2">
          <h3 className="font-pixel text-[10px] text-neon-magenta mb-2">NOTIFICATIONS</h3>
          <PushNotificationToggle showStatus />
        </div>

        {/* Version Info */}
        <div className="pt-4 text-center">
          <p className="text-arcade-muted font-pixel text-[10px]">MINI GAME HEAVEN v1.0.0</p>
        </div>
      </div>
    </Modal>
  );
}

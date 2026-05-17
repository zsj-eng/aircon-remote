import type { FC } from 'react';
import type { ACMode } from '../../types';
import { getModeLabel } from '../../utils/irUtils';

interface ModeSelectorProps {
  currentMode: ACMode;
  power: boolean;
  onModeChange: (mode: ACMode) => void;
}

const modes: { mode: ACMode; icon: string; color: string }[] = [
  { mode: 'cool', icon: '❄️', color: '#00d4ff' },
  { mode: 'heat', icon: '🔥', color: '#ff6b35' },
  { mode: 'dry', icon: '💧', color: '#ffd700' },
  { mode: 'fan', icon: '💨', color: '#90ee90' },
  { mode: 'auto', icon: '🔄', color: '#b088ff' },
];

const ModeSelector: FC<ModeSelectorProps> = ({ currentMode, power, onModeChange }) => {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-2 text-center">模式</div>
      <div className="flex justify-center gap-3">
        {modes.map(({ mode, icon, color }) => {
          const active = power && currentMode === mode;
          return (
            <button
              key={mode}
              onClick={() => power && onModeChange(mode)}
              disabled={!power}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 active:scale-90 min-w-[56px]"
              style={{
                background: active ? color + '20' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.05)'}`,
                color: active ? color : '#555',
                opacity: power ? 1 : 0.4,
              }}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-xs whitespace-nowrap">{getModeLabel(mode)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;

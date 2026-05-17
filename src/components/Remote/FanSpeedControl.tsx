import type { FC } from 'react';
import type { FanSpeed } from '../../types';
import { getFanLabel } from '../../utils/irUtils';

interface FanSpeedControlProps {
  speed: FanSpeed;
  power: boolean;
  onChange: (speed: FanSpeed) => void;
}

const speeds: { speed: FanSpeed; icon: string; color: string }[] = [
  { speed: 'auto', icon: '🔄', color: '#b088ff' },
  { speed: 'low', icon: '🌬️', color: '#90ee90' },
  { speed: 'medium', icon: '💨', color: '#00d4ff' },
  { speed: 'high', icon: '🌪️', color: '#ff6b35' },
];

const FanSpeedControl: FC<FanSpeedControlProps> = ({ speed, power, onChange }) => {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-2 text-center">风速</div>
      <div className="flex justify-center gap-2">
        {speeds.map(({ speed: s, icon, color }) => {
          const active = power && speed === s;
          return (
            <button
              key={s}
              onClick={() => power && onChange(s)}
              disabled={!power}
              className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 active:scale-90 min-w-[44px]"
              style={{
                background: active ? color + '20' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? color + '50' : 'rgba(255,255,255,0.05)'}`,
                color: active ? color : '#555',
                opacity: power ? 1 : 0.4,
              }}
            >
              <span className="text-base">{icon}</span>
              <span className="text-[10px] whitespace-nowrap">{getFanLabel(s)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FanSpeedControl;

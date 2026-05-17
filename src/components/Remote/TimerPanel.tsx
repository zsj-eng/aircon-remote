import type { FC } from 'react';
import { TIMER_OPTIONS } from '../../services/irDatabase';

interface TimerPanelProps {
  timerHours: number | null;
  power: boolean;
  onChange: (hours: number | null) => void;
}

const TimerPanel: FC<TimerPanelProps> = ({ timerHours, power, onChange }) => {
  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-2 text-center">定时关机</div>
      <div className="flex justify-center gap-2 flex-wrap">
        <button
          onClick={() => power && onChange(null)}
          disabled={!power}
          className="px-3 py-2 rounded-xl text-xs transition-all duration-200 active:scale-90"
          style={{
            background: !timerHours ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${!timerHours ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
            color: !timerHours ? '#00d4ff' : '#555',
            opacity: power ? 1 : 0.4,
          }}
        >
          关闭
        </button>
        {TIMER_OPTIONS.map(({ value, label }) => {
          const active = power && timerHours === value;
          return (
            <button
              key={value}
              onClick={() => power && onChange(value)}
              disabled={!power}
              className="px-3 py-2 rounded-xl text-xs transition-all duration-200 active:scale-90"
              style={{
                background: active ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${active ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
                color: active ? '#00d4ff' : '#555',
                opacity: power ? 1 : 0.4,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
      {power && timerHours && (
        <div className="text-center mt-2 text-xs text-gray-400">
          将在 {timerHours} 小时后自动关机
        </div>
      )}
    </div>
  );
};

export default TimerPanel;

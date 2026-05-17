import type { FC } from 'react';

interface TempControlProps {
  temperature: number;
  power: boolean;
  onTempUp: () => void;
  onTempDown: () => void;
  min?: number;
  max?: number;
}

const TempControl: FC<TempControlProps> = ({
  temperature,
  power,
  onTempUp,
  onTempDown,
  min = 16,
  max = 30,
}) => {
  const canUp = power && temperature < max;
  const canDown = power && temperature > min;

  return (
    <div className="flex items-center justify-center gap-6 my-4">
      <button
        onClick={onTempDown}
        disabled={!canDown}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 active:scale-90"
        style={{
          background: canDown ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
          color: canDown ? '#00d4ff' : '#444',
          border: `1px solid ${canDown ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
        }}
        aria-label="降低温度"
      >
        −
      </button>

      <div className="flex flex-col items-center min-w-[60px]">
        <span className="text-xs text-gray-500 mb-1">温度</span>
        <span className="text-lg font-semibold">{temperature}°C</span>
        <div className="flex gap-1 mt-1">
          {[16, 20, 24, 28].map(t => (
            <div
              key={t}
              className="w-4 h-1 rounded-full"
              style={{ background: temperature >= t && power ? '#00d4ff' : '#333' }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onTempUp}
        disabled={!canUp}
        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 active:scale-90"
        style={{
          background: canUp ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.05)',
          color: canUp ? '#ff6b35' : '#444',
          border: `1px solid ${canUp ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.05)'}`,
        }}
        aria-label="升高温度"
      >
        +
      </button>
    </div>
  );
};

export default TempControl;

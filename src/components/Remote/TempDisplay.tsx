import type { FC } from 'react';

interface TempDisplayProps {
  temperature: number;
  power: boolean;
  mode: string;
}

const TempDisplay: FC<TempDisplayProps> = ({ temperature, power, mode }) => {
  const modeColors: Record<string, string> = {
    cool: '#00d4ff',
    heat: '#ff6b35',
    dry: '#ffd700',
    fan: '#90ee90',
    auto: '#b088ff',
  };

  const ringColor = power ? modeColors[mode] || '#00d4ff' : '#333';

  return (
    <div className="flex flex-col items-center mb-6">
      <div
        className="relative w-40 h-40 rounded-full flex items-center justify-center mb-2"
        style={{
          background: `conic-gradient(${ringColor} 0deg, transparent 60deg, transparent 300deg, ${ringColor} 360deg)`,
          padding: '3px',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#0f0f23] flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold tracking-tight transition-colors duration-300"
            style={{ color: power ? ringColor : '#555' }}
          >
            {power ? temperature : '--'}
          </span>
          <span className="text-xs mt-1" style={{ color: power ? ringColor : '#555' }}>
            °C
          </span>
        </div>
      </div>
      {power && (
        <span className="text-sm px-3 py-1 rounded-full" style={{ background: ringColor + '20', color: ringColor }}>
          {mode === 'cool' ? '❄️ 制冷中' :
           mode === 'heat' ? '🔥 制热中' :
           mode === 'dry' ? '💧 除湿中' :
           mode === 'fan' ? '💨 送风中' : '🔄 自动'}
        </span>
      )}
    </div>
  );
};

export default TempDisplay;

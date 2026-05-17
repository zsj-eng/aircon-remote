import type { FC } from 'react';

interface PowerButtonProps {
  power: boolean;
  onClick: () => void;
}

const PowerButton: FC<PowerButtonProps> = ({ power, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-300 active:scale-90 shadow-lg"
      style={{
        background: power
          ? 'linear-gradient(135deg, #00d4ff, #0088aa)'
          : 'linear-gradient(135deg, #333, #1a1a1a)',
        boxShadow: power
          ? '0 0 30px rgba(0, 212, 255, 0.4)'
          : '0 0 10px rgba(0, 0, 0, 0.3)',
      }}
      aria-label={power ? '关闭' : '开启'}
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
        <line x1="12" y1="2" x2="12" y2="12" />
      </svg>
    </button>
  );
};

export default PowerButton;

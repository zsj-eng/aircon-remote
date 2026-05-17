import type { FC } from 'react';

interface SwingControlProps {
  swing: boolean;
  power: boolean;
  onToggle: () => void;
}

const SwingControl: FC<SwingControlProps> = ({ swing, power, onToggle }) => {
  const active = power && swing;
  const color = active ? '#00d4ff' : '#555';

  return (
    <div className="mb-4">
      <div className="text-xs text-gray-500 mb-2 text-center">摆风</div>
      <div className="flex justify-center">
        <button
          onClick={() => power && onToggle()}
          disabled={!power}
          className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 active:scale-90"
          style={{
            background: active ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${active ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
            color,
            opacity: power ? 1 : 0.4,
          }}
        >
          <span className="text-xl">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2v4M12 18v4M4.93 6.34l2.83 2.83M16.24 14.83l2.83 2.83M2 12h4M18 12h4M4.93 17.66l2.83-2.83M16.24 9.17l2.83-2.83" />
            </svg>
          </span>
          <span className="text-xs">{active ? '已开启' : '已关闭'}</span>
        </button>
      </div>
    </div>
  );
};

export default SwingControl;

import type { FC } from 'react';

interface SettingsPanelProps {
  notificationsEnabled: boolean;
  notifyHot: boolean;
  notifyCold: boolean;
  hotThreshold: number;
  coldThreshold: number;
  permissionStatus: string;
  onToggleNotifications: (v: boolean) => void;
  onToggleHot: (v: boolean) => void;
  onToggleCold: (v: boolean) => void;
  onHotThreshold: (v: number) => void;
  onColdThreshold: (v: number) => void;
  onRequestPermission: () => void;
  onClose: () => void;
  onCheckNow: () => void;
  checking: boolean;
}

const SettingsPanel: FC<SettingsPanelProps> = ({
  notificationsEnabled,
  notifyHot,
  notifyCold,
  hotThreshold,
  coldThreshold,
  permissionStatus,
  onToggleNotifications,
  onToggleHot,
  onToggleCold,
  onHotThreshold,
  onColdThreshold,
  onRequestPermission,
  onClose,
  onCheckNow,
  checking,
}) => {
  const permissionLabel =
    permissionStatus === 'granted' ? '已授权 ✅' :
    permissionStatus === 'denied' ? '已拒绝 ❌' :
    permissionStatus === 'unsupported' ? '不支持 ⚠️' : '未授权';

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f23] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-lg font-semibold">设置</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Notification permission */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">通知权限</span>
            <span className="text-xs" style={{ color: permissionStatus === 'granted' ? '#4ade80' : '#f87171' }}>
              {permissionLabel}
            </span>
          </div>
          {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
            <button
              onClick={onRequestPermission}
              className="w-full py-2 rounded-lg text-sm mt-2 transition-colors"
              style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}
            >
              请求通知权限
            </button>
          )}
        </div>

        {/* Smart notifications toggle */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">智能天气提醒</div>
              <div className="text-xs text-gray-400 mt-1">根据天气自动建议是否开空调</div>
            </div>
            <ToggleSwitch checked={notificationsEnabled} onChange={onToggleNotifications} />
          </div>
        </div>

        {notificationsEnabled && (
          <>
            {/* Hot notification */}
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium">闷热提醒</div>
                  <div className="text-xs text-gray-400 mt-1">体感温度高于阈值时提醒</div>
                </div>
                <ToggleSwitch checked={notifyHot} onChange={onToggleHot} />
              </div>
              {notifyHot && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">阈值</span>
                  <input
                    type="range"
                    min={24}
                    max={35}
                    value={hotThreshold}
                    onChange={e => onHotThreshold(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-[#ff6b35] w-10 text-right">{hotThreshold}°C</span>
                </div>
              )}
            </div>

            {/* Cold notification */}
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-medium">低温提醒</div>
                  <div className="text-xs text-gray-400 mt-1">温度低于阈值时提醒</div>
                </div>
                <ToggleSwitch checked={notifyCold} onChange={onToggleCold} />
              </div>
              {notifyCold && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">阈值</span>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={coldThreshold}
                    onChange={e => onColdThreshold(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-[#00d4ff] w-10 text-right">{coldThreshold}°C</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* Manual check */}
        <button
          onClick={onCheckNow}
          disabled={checking}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-98"
          style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}
        >
          {checking ? '检查中...' : '🔍 立即检查天气并评估'}
        </button>
      </div>
    </div>
  );
};

// Simple toggle switch
const ToggleSwitch: FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
    style={{ background: checked ? '#00d4ff' : '#333' }}
  >
    <div
      className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 shadow"
      style={{ left: checked ? 'calc(100% - 22px)' : '2px' }}
    />
  </button>
);

export default SettingsPanel;

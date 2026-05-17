import { useState, useCallback, useEffect } from 'react';
import type { ACState, ACType, AppSettings } from './types';
import RemotePanel from './components/Remote/RemotePanel';
import BrandSelector from './components/BrandSelector';
import WeatherCard from './components/WeatherCard';
import SettingsPanel from './components/SettingsPanel';
import { useWeather } from './hooks/useWeather';
import { useNotification } from './hooks/useNotification';
import { getBrandById } from './services/irDatabase';

const DEFAULT_AC_STATE: ACState = {
  power: false,
  mode: 'cool',
  temperature: 26,
  fanSpeed: 'auto',
  swing: false,
  timerHours: null,
};

const DEFAULT_SETTINGS: AppSettings = {
  selectedBrand: null,
  acType: null,
  location: null,
  notificationsEnabled: true,
  notifyHot: true,
  notifyCold: true,
  hotThreshold: 28,
  coldThreshold: 10,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('ac_remote_settings');
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function App() {
  const [acState, setAcState] = useState<ACState>(DEFAULT_AC_STATE);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [showBrandSelector, setShowBrandSelector] = useState(!settings.selectedBrand);
  const [toast, setToast] = useState<string | null>(null);
  const [lastSent, setLastSent] = useState<string>('');

  const { weather, loading: weatherLoading, error: weatherError, refresh: refreshWeather } = useWeather();
  const { permission, checking, lastCheck, requestPermission, doCheck } = useNotification();

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('ac_remote_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleStateChange = useCallback((partial: Partial<ACState>) => {
    setAcState(prev => ({ ...prev, ...partial }));
  }, []);

  const handleSendSignal = useCallback((result: { success: boolean; message: string }) => {
    setLastSent(result.message);
    showToast(result.message);
  }, []);

  const handleBrandSelect = useCallback((brandId: string, acType: ACType) => {
    setSettings(prev => ({ ...prev, selectedBrand: brandId, acType }));
    setShowBrandSelector(false);
    showToast(`已选择: ${getBrandById(brandId)?.name || brandId}`);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const tabs = [
    { id: 'remote' as const, label: '遥控', icon: '📱' },
    { id: 'weather' as const, label: '天气', icon: '🌤️' },
    { id: 'settings' as const, label: '设置', icon: '⚙️' },
  ];
  const [activeTab, setActiveTab] = useState<'remote' | 'weather' | 'settings'>('remote');

  return (
    <div className="min-h-dvh flex flex-col bg-[#0f0f23] text-[#e8e8e8]">
      {/* App Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">❄️</span>
          <div>
            <h1 className="text-base font-semibold">空调遥控器</h1>
            <p className="text-[10px] text-gray-500">
              {settings.selectedBrand
                ? `品牌: ${getBrandById(settings.selectedBrand)?.name || '未知'}`
                : '未选择品牌'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowBrandSelector(true)}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}
        >
          切换品牌
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-all duration-200 relative"
            style={{
              color: activeTab === tab.id ? '#00d4ff' : '#555',
              borderBottom: activeTab === tab.id ? '2px solid #00d4ff' : '2px solid transparent',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'remote' && (
          <div className="pt-4">
            {!settings.selectedBrand && (
              <div
                className="mx-4 mb-4 p-4 rounded-xl text-center"
                style={{ background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)' }}
              >
                <p className="text-sm text-[#ff6b35] mb-2">未选择空调品牌</p>
                <button
                  onClick={() => setShowBrandSelector(true)}
                  className="text-sm px-4 py-2 rounded-lg font-medium"
                  style={{ background: 'rgba(255,107,53,0.2)', color: '#ff6b35' }}
                >
                  前往选择品牌 →
                </button>
              </div>
            )}
            <RemotePanel
              state={acState}
              settings={settings}
              onStateChange={handleStateChange}
              onSendSignal={handleSendSignal}
            />
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="pt-4">
            <WeatherCard
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
              onRefresh={refreshWeather}
              onSetLocation={() => {
                navigator.geolocation?.getCurrentPosition(
                  () => refreshWeather(),
                  (err) => showToast(`定位失败: ${err.message}`),
                  { timeout: 10000 }
                );
              }}
            />

            {lastCheck && (
              <div
                className="mx-4 mb-4 p-4 rounded-xl"
                style={{
                  background: lastCheck.notified ? 'rgba(255,107,53,0.1)' : 'rgba(144,238,144,0.1)',
                  border: `1px solid ${lastCheck.notified ? 'rgba(255,107,53,0.2)' : 'rgba(144,238,144,0.2)'}`,
                }}
              >
                <div className="text-sm font-medium mb-1">
                  {lastCheck.notified ? '🔔 已发送提醒' : '✅ 评估完成'}
                </div>
                <div className="text-xs text-gray-400">{lastCheck.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  检查时间: {lastCheck.time.toLocaleString('zh-CN')}
                </div>
              </div>
            )}

            <div className="mx-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-sm font-medium mb-2">通知状态</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>通知开关</span>
                  <span style={{ color: settings.notificationsEnabled ? '#4ade80' : '#f87171' }}>
                    {settings.notificationsEnabled ? '开启' : '关闭'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>通知权限</span>
                  <span style={{ color: permission === 'granted' ? '#4ade80' : '#f87171' }}>
                    {permission === 'granted' ? '已授权' : permission === 'denied' ? '已拒绝' : '未授权'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>闷热提醒阈值</span>
                  <span style={{ color: '#ff6b35' }}>{settings.hotThreshold}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>低温提醒阈值</span>
                  <span style={{ color: '#00d4ff' }}>{settings.coldThreshold}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>检查频率</span>
                  <span>每小时</span>
                </div>
              </div>
              <button
                onClick={() => {
                  requestPermission();
                  doCheck();
                }}
                disabled={checking}
                className="w-full py-2.5 rounded-lg text-sm mt-3 transition-colors"
                style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}
              >
                {checking ? '检查中...' : '🔍 立即检查'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="pt-4">
            <SettingsPanel
              notificationsEnabled={settings.notificationsEnabled}
              notifyHot={settings.notifyHot}
              notifyCold={settings.notifyCold}
              hotThreshold={settings.hotThreshold}
              coldThreshold={settings.coldThreshold}
              permissionStatus={permission}
              onToggleNotifications={(v) => updateSetting('notificationsEnabled', v)}
              onToggleHot={(v) => updateSetting('notifyHot', v)}
              onToggleCold={(v) => updateSetting('notifyCold', v)}
              onHotThreshold={(v) => updateSetting('hotThreshold', v)}
              onColdThreshold={(v) => updateSetting('coldThreshold', v)}
              onRequestPermission={requestPermission}
              onClose={() => setActiveTab('remote')}
              onCheckNow={doCheck}
              checking={checking}
            />
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      {lastSent && (
        <div className="px-4 py-2 border-t border-white/5 text-center">
          <span className="text-xs text-gray-500">上次操作: {lastSent}</span>
        </div>
      )}

      {/* Brand Selector Overlay */}
      {showBrandSelector && (
        <BrandSelector
          selectedBrand={settings.selectedBrand}
          selectedType={settings.acType}
          onSelect={handleBrandSelect}
          onClose={() => setShowBrandSelector(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm animate-pulse"
          style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;

import type { FC } from 'react';
import type { ACState, ACMode, FanSpeed, AppSettings } from '../../types';
import TempDisplay from './TempDisplay';
import PowerButton from './PowerButton';
import TempControl from './TempControl';
import ModeSelector from './ModeSelector';
import FanSpeedControl from './FanSpeedControl';
import SwingControl from './SwingControl';
import TimerPanel from './TimerPanel';
import { sendIRSignal, getBrandById } from '../../services/irDatabase';

interface RemotePanelProps {
  state: ACState;
  settings: AppSettings;
  onStateChange: (partial: Partial<ACState>) => void;
  onSendSignal: (result: { success: boolean; message: string }) => void;
}

const RemotePanel: FC<RemotePanelProps> = ({ state, settings, onStateChange, onSendSignal }) => {
  const brandInfo = settings.selectedBrand ? getBrandById(settings.selectedBrand) : null;

  const sendCommand = async (command: string, params: Record<string, unknown> = {}) => {
    const result = await sendIRSignal(settings.selectedBrand || 'gree', command, params);
    onSendSignal(result);
  };

  const handlePower = () => {
    const newPower = !state.power;
    onStateChange({ power: newPower });
    sendCommand(newPower ? 'power_on' : 'power_off');
  };

  const handleTempUp = () => {
    if (state.temperature < 30) {
      const newTemp = state.temperature + 1;
      onStateChange({ temperature: newTemp });
      sendCommand('temp_up', { temp: newTemp });
    }
  };

  const handleTempDown = () => {
    if (state.temperature > 16) {
      const newTemp = state.temperature - 1;
      onStateChange({ temperature: newTemp });
      sendCommand('temp_down', { temp: newTemp });
    }
  };

  const handleModeChange = (mode: ACMode) => {
    onStateChange({ mode });
    sendCommand(`mode_${mode}`);
  };

  const handleFanChange = (fanSpeed: FanSpeed) => {
    onStateChange({ fanSpeed });
    sendCommand(`fan_${fanSpeed}`);
  };

  const handleSwing = () => {
    const newSwing = !state.swing;
    onStateChange({ swing: newSwing });
    sendCommand(newSwing ? 'swing_on' : 'swing_off');
  };

  const handleTimer = (hours: number | null) => {
    onStateChange({ timerHours: hours });
    if (hours) sendCommand('timer', { hours });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto px-4 pb-8">
      {/* Brand indicator */}
      {brandInfo && (
        <div className="text-xs text-gray-500 mb-4 text-center">
          当前品牌: {brandInfo.name}
        </div>
      )}

      {/* Temperature Display */}
      <TempDisplay
        temperature={state.temperature}
        power={state.power}
        mode={state.mode}
      />

      {/* Power Button */}
      <div className="mb-6">
        <PowerButton power={state.power} onClick={handlePower} />
      </div>

      {/* Temperature Control */}
      <TempControl
        temperature={state.temperature}
        power={state.power}
        onTempUp={handleTempUp}
        onTempDown={handleTempDown}
      />

      {/* Mode Selector */}
      <ModeSelector
        currentMode={state.mode}
        power={state.power}
        onModeChange={handleModeChange}
      />

      {/* Fan Speed */}
      <FanSpeedControl
        speed={state.fanSpeed}
        power={state.power}
        onChange={handleFanChange}
      />

      {/* Swing */}
      <SwingControl
        swing={state.swing}
        power={state.power}
        onToggle={handleSwing}
      />

      {/* Timer */}
      <TimerPanel
        timerHours={state.timerHours}
        power={state.power}
        onChange={handleTimer}
      />

      {/* State summary when on */}
      {state.power && (
        <div className="w-full mt-2 p-3 rounded-xl text-xs" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex justify-between text-gray-400">
            <span>模式</span>
            <span className="text-gray-200">{
              { cool: '制冷', heat: '制热', dry: '除湿', fan: '送风', auto: '自动' }[state.mode]
            }</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-1">
            <span>风速</span>
            <span className="text-gray-200">{
              { auto: '自动', low: '低', medium: '中', high: '高' }[state.fanSpeed]
            }</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-1">
            <span>摆风</span>
            <span className="text-gray-200">{state.swing ? '开' : '关'}</span>
          </div>
          {state.timerHours && (
            <div className="flex justify-between text-gray-400 mt-1">
              <span>定时</span>
              <span className="text-gray-200">{state.timerHours}h 后关机</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RemotePanel;

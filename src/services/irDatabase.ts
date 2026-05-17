import type { BrandConfig, ACType, ACState } from '../types';
import { IrTransmitter } from '../plugins/IrTransmitterPlugin';
import { generateIRCode } from '../utils/irUtils';

export const BRANDS: BrandConfig[] = [
  { id: 'gree', name: '格力 (Gree)', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'midea', name: '美的 (Midea)', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'haier', name: '海尔 (Haier)', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'hisense', name: '海信 (Hisense)', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'aux', name: '奥克斯 (AUX)', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'tcl', name: 'TCL', types: ['wall', 'desktop', 'cabinet'] },
  { id: 'chigo', name: '志高 (Chigo)', types: ['wall', 'desktop'] },
  { id: 'changhong', name: '长虹 (Changhong)', types: ['wall', 'desktop'] },
  { id: 'kelon', name: '科龙 (Kelon)', types: ['wall', 'desktop'] },
  { id: 'panasonic', name: '松下 (Panasonic)', types: ['wall', 'cabinet'] },
  { id: 'daikin', name: '大金 (Daikin)', types: ['wall', 'cabinet'] },
  { id: 'mitsubishi', name: '三菱 (Mitsubishi)', types: ['wall', 'cabinet'] },
];

export const AC_TYPE_LABELS: Record<ACType, string> = {
  wall: '挂壁式',
  desktop: '台式',
  cabinet: '柜式',
};

export const TIMER_OPTIONS = [
  { value: 0.5, label: '0.5小时' },
  { value: 1, label: '1小时' },
  { value: 2, label: '2小时' },
  { value: 4, label: '4小时' },
  { value: 8, label: '8小时' },
];

export function getBrandById(id: string): BrandConfig | undefined {
  return BRANDS.find(b => b.id === id);
}

// Check if the device has an IR emitter (only meaningful in native app)
export async function checkIREmitter(): Promise<boolean> {
  try {
    const result = await IrTransmitter.hasIrEmitter();
    return result.hasIr;
  } catch {
    return false;
  }
}

// Send actual IR signal using the Capacitor native plugin
// Falls back to simulation when running in browser
export async function sendIRSignal(
  brand: string,
  acState: ACState,
  command: string,
  params: Record<string, unknown> = {}
): Promise<{ success: boolean; message: string; codePreview: string }> {
  const codePreview = generateCodePreview(brand, command, params);

  // Try native IR transmission via Capacitor plugin
  try {
    const { hasIr } = await IrTransmitter.hasIrEmitter();
    if (hasIr) {
      // Generate real NEC pulse pattern using the current AC state
      const pulses = generateIRCode(
        brand,
        acState.mode,
        acState.temperature,
        acState.fanSpeed,
        acState.power
      );

      await IrTransmitter.transmit({
        frequency: 38000,
        pattern: pulses,
      });

      return { success: true, message: '红外信号已发射 ✓', codePreview };
    }
  } catch {
    // Plugin not available or error — fall through to simulation
  }

  // Browser / no IR hardware: simulation mode
  console.log(`[IR Sim] ${brand} ${command}:`, codePreview);
  return {
    success: false,
    message: `模拟模式: ${command}`,
    codePreview,
  };
}

function generateCodePreview(brand: string, command: string, params: Record<string, unknown>): string {
  const brandHex = {
    gree: '01', midea: '02', haier: '03', hisense: '04',
    aux: '05', tcl: '06', chigo: '07', changhong: '08',
    kelon: '09', panasonic: '0A', daikin: '0B', mitsubishi: '0C',
  }[brand] || '01';

  const cmdMap: Record<string, string> = {
    power_on: '10', power_off: '00',
    mode_cool: '11', mode_heat: '12', mode_dry: '13', mode_fan: '14', mode_auto: '15',
    temp_up: '20', temp_down: '21',
    fan_low: '30', fan_med: '31', fan_high: '32', fan_auto: '33',
    swing_on: '40', swing_off: '41',
    timer: '50',
  };

  const cmdHex = cmdMap[command] || 'FF';
  const paramHex = params.temp ? Number(params.temp).toString(16).padStart(2, '0') : '00';

  return `NEC: ${brandHex}${cmdHex}${paramHex}EE`;
}

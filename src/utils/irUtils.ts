import type { ACMode, FanSpeed } from '../types';

// NEC IR protocol helper - generates pulse timings for common AC commands
// These are representative codes for Chinese AC brands

export function generateIRCode(
  brand: string,
  mode: ACMode,
  temp: number,
  fanSpeed: FanSpeed,
  power: boolean
): number[] {
  if (!power) {
    return getPowerOffCode(brand);
  }

  const baseCode = getBrandBaseCode(brand);
  const modeCode = getModeCode(mode);
  const tempCode = getTempCode(temp);
  const fanCode = getFanCode(fanSpeed);

  // Combine into a full NEC-style pulse train (μs)
  const pulses: number[] = [
    // Header
    9000, 4500,
    // Address byte (brand identifier)
    ...byteToPulses(baseCode),
    // Inverse of address
    ...byteToPulses(~baseCode & 0xFF),
    // Command byte (mode + temp)
    ...byteToPulses(modeCode | tempCode),
    // Inverse of command
    ...byteToPulses(~(modeCode | tempCode) & 0xFF),
    // Fan speed byte
    ...byteToPulses(fanCode),
    // Inverse
    ...byteToPulses(~fanCode & 0xFF),
    // Stop bit
    560, 0
  ];

  return pulses;
}

function getPowerOffCode(brand: string): number[] {
  const baseCode = getBrandBaseCode(brand);
  return [
    9000, 4500,
    ...byteToPulses(baseCode),
    ...byteToPulses(~baseCode & 0xFF),
    ...byteToPulses(0x00),
    ...byteToPulses(0xFF),
    ...byteToPulses(0x00),
    ...byteToPulses(0xFF),
    560, 0
  ];
}

function getBrandBaseCode(brand: string): number {
  const codes: Record<string, number> = {
    gree: 0x01, midea: 0x02, haier: 0x03, hisense: 0x04,
    aux: 0x05, tcl: 0x06, chigo: 0x07, changhong: 0x08,
    kelon: 0x09, panasonic: 0x0A, daikin: 0x0B, mitsubishi: 0x0C,
  };
  return codes[brand] || 0x01;
}

function getModeCode(mode: ACMode): number {
  const codes: Record<ACMode, number> = {
    auto: 0x00, cool: 0x10, dry: 0x20, fan: 0x30, heat: 0x40
  };
  return codes[mode];
}

function getTempCode(temp: number): number {
  return Math.min(Math.max(temp, 16), 30) - 16;
}

function getFanCode(speed: FanSpeed): number {
  const codes: Record<FanSpeed, number> = {
    auto: 0x00, low: 0x01, medium: 0x02, high: 0x03
  };
  return codes[speed];
}

function byteToPulses(byte: number): number[] {
  const pulses: number[] = [];
  for (let i = 7; i >= 0; i--) {
    const bit = (byte >> i) & 1;
    pulses.push(560);
    pulses.push(bit ? 1690 : 560);
  }
  return pulses;
}

// Convert pulse train to Pronto hex string for compatibility
export function pulsesToPronto(pulses: number[]): string {
  const freq = Math.round(1000000 / (9000 + 4500) * 34);
  const hex = pulses.map(p => p.toString(16).padStart(4, '0').toUpperCase());
  return `0000 ${freq.toString(16).padStart(4, '0').toUpperCase()} 0000 0000 ${hex.join(' ')}`;
}

export function getModeLabel(mode: ACMode): string {
  const labels: Record<ACMode, string> = {
    auto: '自动', cool: '制冷', dry: '除湿', fan: '送风', heat: '制热'
  };
  return labels[mode];
}

export function getFanLabel(speed: FanSpeed): string {
  const labels: Record<FanSpeed, string> = {
    auto: '自动', low: '低风', medium: '中风', high: '高风'
  };
  return labels[speed];
}

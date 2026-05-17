import { WebPlugin } from '@capacitor/core';
import type { IrTransmitterPlugin, IrTransmitOptions, IrTransmitResult } from './definitions';

export class IrTransmitterWeb extends WebPlugin implements IrTransmitterPlugin {
  async hasIrEmitter(): Promise<{ hasIr: boolean }> {
    // Web browsers don't have IR hardware access
    return { hasIr: false };
  }

  async transmit(_options: IrTransmitOptions): Promise<IrTransmitResult> {
    // Web fallback — no IR hardware available
    console.warn('[IrTransmitter] Web fallback: IR transmission is not available in browser.');
    return {
      success: false,
      message: '浏览器环境不支持红外发射，请安装 Android APK 版本',
    };
  }
}

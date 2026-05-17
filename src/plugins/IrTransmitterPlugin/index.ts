import { registerPlugin } from '@capacitor/core';
import type { IrTransmitterPlugin } from './definitions';
import { IrTransmitterWeb } from './web';

const IrTransmitter = registerPlugin<IrTransmitterPlugin>('IrTransmitter', {
  web: () => new IrTransmitterWeb(),
});

export { IrTransmitter };
export type { IrTransmitterPlugin, IrTransmitOptions, IrTransmitResult } from './definitions';

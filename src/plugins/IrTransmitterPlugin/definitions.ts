export interface IrTransmitOptions {
  /** Carrier frequency in Hz (typically 38000 for AC) */
  frequency: number;
  /** Pulse/space durations in microseconds, alternating */
  pattern: number[];
}

export interface IrTransmitResult {
  success: boolean;
  message: string;
}

export interface IrTransmitterPlugin {
  /** Check if the device has an IR blaster */
  hasIrEmitter(): Promise<{ hasIr: boolean }>;
  /** Transmit an IR signal using the given pattern */
  transmit(options: IrTransmitOptions): Promise<IrTransmitResult>;
}

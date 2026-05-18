import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aircon.remote',
  appName: '空调遥控器',
  webDir: 'dist',
  plugins: {
    IrTransmitter: {}
  },
  includePlugins: ['IrTransmitter']
};

export default config;

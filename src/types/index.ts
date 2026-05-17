export type ACMode = 'cool' | 'heat' | 'dry' | 'fan' | 'auto';
export type FanSpeed = 'auto' | 'low' | 'medium' | 'high';
export type ACType = 'wall' | 'desktop' | 'cabinet';

export interface ACState {
  power: boolean;
  mode: ACMode;
  temperature: number;
  fanSpeed: FanSpeed;
  swing: boolean;
  timerHours: number | null;
}

export interface BrandConfig {
  id: string;
  name: string;
  types: ACType[];
}

export interface IRCode {
  power: string;
  mode: Record<ACMode, string>;
  temp: Record<number, string>;
  fanSpeed: Record<FanSpeed, string>;
  swing: { on: string; off: string };
  timer: Record<number, string>;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  windSpeed: number;
}

export interface NotificationRule {
  id: string;
  condition: string;
  message: string;
  enabled: boolean;
}

export interface AppSettings {
  selectedBrand: string | null;
  acType: ACType | null;
  location: { lat: number; lon: number; name: string } | null;
  notificationsEnabled: boolean;
  notifyHot: boolean;
  notifyCold: boolean;
  hotThreshold: number;
  coldThreshold: number;
}

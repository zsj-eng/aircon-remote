import { LocalNotifications } from '@capacitor/local-notifications';
import { fetchWeather, getCurrentPosition } from './weatherApi';
import { getComfortAdvice } from '../utils/weatherUtils';

const STORAGE_KEY_SETTINGS = 'ac_remote_settings';
const STORAGE_KEY_LAST_NOTIFY = 'ac_remote_last_notify';
const NOTIFY_CHANNEL_ID = 'ac-reminder';

interface NotifySettings {
  enabled: boolean;
  hotThreshold: number;
  coldThreshold: number;
  notifyHot: boolean;
  notifyCold: boolean;
}

function getSettings(): NotifySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        enabled: parsed.notificationsEnabled ?? true,
        hotThreshold: parsed.hotThreshold ?? 28,
        coldThreshold: parsed.coldThreshold ?? 10,
        notifyHot: parsed.notifyHot ?? true,
        notifyCold: parsed.notifyCold ?? true,
      };
    }
  } catch { /* ignore */ }

  return {
    enabled: true,
    hotThreshold: 28,
    coldThreshold: 10,
    notifyHot: true,
    notifyCold: true,
  };
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch {
    // Fallback to web API if Capacitor plugin not available
    if ('Notification' in window) {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'denied') return false;
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
    return false;
  }
}

export async function checkNotificationPermission(): Promise<string> {
  try {
    const result = await LocalNotifications.checkPermissions();
    return result.display;
  } catch {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }
}

export async function sendLocalNotification(title: string, body: string): Promise<void> {
  // 1-hour cooldown to avoid spamming
  const lastNotify = localStorage.getItem(STORAGE_KEY_LAST_NOTIFY);
  if (lastNotify) {
    const elapsed = Date.now() - parseInt(lastNotify);
    if (elapsed < 60 * 60 * 1000) return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: 1,
          schedule: { at: new Date(Date.now() + 500) },
          sound: 'default',
          smallIcon: 'ic_launcher',
          channelId: NOTIFY_CHANNEL_ID,
        },
      ],
    });

    localStorage.setItem(STORAGE_KEY_LAST_NOTIFY, Date.now().toString());
  } catch {
    // Fallback to web API
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/icon-192.png', tag: 'ac-advice' });
      localStorage.setItem(STORAGE_KEY_LAST_NOTIFY, Date.now().toString());
    }
  }
}

export async function checkAndNotify(): Promise<{
  checked: boolean;
  notified: boolean;
  message: string;
}> {
  const settings = getSettings();
  if (!settings.enabled) {
    return { checked: false, notified: false, message: '通知已关闭' };
  }

  try {
    const pos = await getCurrentPosition();
    const weather = await fetchWeather(pos.lat, pos.lon);

    const advice = getComfortAdvice(
      weather.temperature,
      weather.feelsLike,
      weather.humidity,
      { hot: settings.hotThreshold, cold: settings.coldThreshold }
    );

    if (advice.shouldNotify) {
      const isHeatNotify = advice.message.includes('制热');
      const enabled = isHeatNotify ? settings.notifyCold : settings.notifyHot;

      if (enabled) {
        await sendLocalNotification('空调遥控器 - 智能提醒', advice.message);
        return { checked: true, notified: true, message: advice.message };
      }
    }

    return { checked: true, notified: false, message: '温度适宜' };
  } catch (err) {
    console.error('天气检查失败:', err);
    return { checked: false, notified: false, message: '检查失败' };
  }
}

// Setup periodic check
let periodicInterval: number | null = null;

export function startPeriodicCheck(intervalMs: number = 60 * 60 * 1000): void {
  stopPeriodicCheck();
  checkAndNotify();
  periodicInterval = window.setInterval(checkAndNotify, intervalMs);
}

export function stopPeriodicCheck(): void {
  if (periodicInterval !== null) {
    clearInterval(periodicInterval);
    periodicInterval = null;
  }
}

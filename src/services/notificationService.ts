import { fetchWeather, getCurrentPosition } from './weatherApi';
import { getComfortAdvice } from '../utils/weatherUtils';

const STORAGE_KEY_SETTINGS = 'ac_remote_settings';
const STORAGE_KEY_LAST_NOTIFY = 'ac_remote_last_notify';

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
  if (!('Notification' in window)) {
    console.log('此浏览器不支持通知');
    return false;
  }

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendLocalNotification(title: string, body: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Check if we sent a notification in the last 3 hours
  const lastNotify = localStorage.getItem(STORAGE_KEY_LAST_NOTIFY);
  if (lastNotify) {
    const elapsed = Date.now() - parseInt(lastNotify);
    if (elapsed < 3 * 60 * 60 * 1000) return; // 3h cooldown
  }

  new Notification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'ac-advice',
    requireInteraction: false,
    // vibrate is supported in most mobile browsers
    ...({ vibrate: [200, 100, 200] } as NotificationOptions),
  });

  localStorage.setItem(STORAGE_KEY_LAST_NOTIFY, Date.now().toString());
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
      const enabled = advice.severity === 'strong'
        ? (advice.message.includes('制热') ? settings.notifyCold : settings.notifyHot)
        : settings.notifyHot;

      if (enabled) {
        sendLocalNotification('空调遥控器 - 智能提醒', advice.message);
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
  // Check immediately
  checkAndNotify();
  // Then check periodically
  periodicInterval = window.setInterval(checkAndNotify, intervalMs);
}

export function stopPeriodicCheck(): void {
  if (periodicInterval !== null) {
    clearInterval(periodicInterval);
    periodicInterval = null;
  }
}

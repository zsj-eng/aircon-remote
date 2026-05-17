import { useState, useCallback, useEffect } from 'react';
import {
  requestNotificationPermission,
  startPeriodicCheck,
  stopPeriodicCheck,
  checkAndNotify,
} from '../services/notificationService';

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<{
    notified: boolean;
    message: string;
    time: Date;
  } | null>(null);

  const requestPermission = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  const doCheck = useCallback(async () => {
    setChecking(true);
    try {
      const result = await checkAndNotify();
      setLastCheck({
        notified: result.notified,
        message: result.message,
        time: new Date(),
      });
      return result;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (permission === 'granted') {
      startPeriodicCheck(60 * 60 * 1000); // Check every hour
      return () => stopPeriodicCheck();
    }
  }, [permission]);

  return { permission, checking, lastCheck, requestPermission, doCheck };
}

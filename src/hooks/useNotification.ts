import { useState, useCallback, useEffect } from 'react';
import {
  requestNotificationPermission,
  checkNotificationPermission,
  startPeriodicCheck,
  stopPeriodicCheck,
  checkAndNotify,
} from '../services/notificationService';

export function useNotification() {
  const [permission, setPermission] = useState<string>('prompt');
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<{
    notified: boolean;
    message: string;
    time: Date;
  } | null>(null);

  // Check permission on mount
  useEffect(() => {
    checkNotificationPermission().then(setPermission);
  }, []);

  // Auto-start periodic check if permission is granted
  useEffect(() => {
    if (permission === 'granted') {
      startPeriodicCheck(60 * 60 * 1000);
      return () => stopPeriodicCheck();
    }
  }, [permission]);

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

  return { permission, checking, lastCheck, requestPermission, doCheck };
}

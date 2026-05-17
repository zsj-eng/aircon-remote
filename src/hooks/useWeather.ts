import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from '../types';
import { fetchWeather, getCurrentPosition } from '../services/weatherApi';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);

  const loadWeather = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);
    try {
      let coords: { lat: number; lon: number };
      if (lat !== undefined && lon !== undefined) {
        coords = { lat, lon };
      } else {
        coords = await getCurrentPosition();
        setLocation({ ...coords, name: `${coords.lat.toFixed(2)}, ${coords.lon.toFixed(2)}` });
      }
      const data = await fetchWeather(coords.lat, coords.lon);
      setWeather(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '获取天气失败';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  const refresh = useCallback(() => {
    if (location) {
      return loadWeather(location.lat, location.lon);
    }
    return loadWeather();
  }, [location, loadWeather]);

  return { weather, loading, error, location, refresh, setLocation };
}

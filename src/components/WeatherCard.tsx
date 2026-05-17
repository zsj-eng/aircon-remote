import type { FC } from 'react';
import type { WeatherData } from '../types';
import { getWeatherIcon } from '../utils/weatherUtils';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSetLocation: () => void;
}

const WeatherCard: FC<WeatherCardProps> = ({ weather, loading, error, onRefresh, onSetLocation }) => {
  return (
    <div
      className="rounded-2xl p-4 mx-4 mb-4"
      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(22,33,62,0.8))', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400">室外天气</span>
        <div className="flex gap-2">
          <button
            onClick={onSetLocation}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}
          >
            📍 定位
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#888' }}
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-center py-3 text-sm text-red-400">
          {error}
          <button onClick={onRefresh} className="ml-2 underline">重试</button>
        </div>
      )}

      {loading && !weather && (
        <div className="text-center py-4 text-gray-500 text-sm">正在获取天气数据...</div>
      )}

      {weather && !loading && (
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {getWeatherIcon(weather.conditionCode)}
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{weather.temperature}°</span>
              <span className="text-sm text-gray-400">体感 {weather.feelsLike}°</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              湿度 {weather.humidity}% · 风力 {weather.windSpeed} km/h
            </div>
            <div className="text-xs text-gray-400">
              {weather.condition}
            </div>
          </div>
        </div>
      )}

      {weather && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">舒适度评估</span>
            <span style={{ color: weather.feelsLike >= 28 ? '#ff6b35' : weather.feelsLike <= 10 ? '#00d4ff' : '#90ee90' }}>
              {weather.feelsLike >= 28 ? '闷热 · 建议制冷' :
               weather.feelsLike <= 10 ? '偏冷 · 建议制热' :
               '舒适 · 无需空调'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;

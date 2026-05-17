// Heat index calculation (Rothfusz regression)
// Used to determine "feels like" temperature for hot conditions
function calculateHeatIndex(tempC: number, humidity: number): number {
  const t = tempC * 9 / 5 + 32; // to Fahrenheit
  const rh = humidity;

  if (t < 80) return tempC;

  let hi = 0.5 * (t + 61.0 + ((t - 68.0) * 1.2) + (rh * 0.094));

  if (hi >= 80) {
    hi = -42.379 +
      2.04901523 * t +
      10.14333127 * rh -
      0.22475541 * t * rh -
      0.00683783 * t * t -
      0.05481717 * rh * rh +
      0.00122874 * t * t * rh +
      0.00085282 * t * rh * rh -
      0.00000199 * t * t * rh * rh;

    if (rh < 13 && t >= 80 && t <= 112) {
      hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
    }
    if (rh > 85 && t >= 80 && t <= 87) {
      hi += ((rh - 85) / 10) * ((87 - t) / 5);
    }
  }

  return (hi - 32) * 5 / 9; // back to Celsius
}

// Wind chill calculation (for cold conditions)
function calculateWindChill(tempC: number, windKmh: number): number {
  if (tempC > 10 || windKmh < 4.8) return tempC;
  const windPow = Math.pow(windKmh, 0.16);
  return 13.12 + 0.6215 * tempC - 11.37 * windPow + 0.3965 * tempC * windPow;
}

export function calculateFeelsLike(tempC: number, humidity: number, windKmh: number): number {
  if (tempC >= 25) {
    return Math.round(calculateHeatIndex(tempC, humidity) * 10) / 10;
  }
  if (tempC <= 10) {
    return Math.round(calculateWindChill(tempC, windKmh) * 10) / 10;
  }
  return tempC;
}

export interface ComfortAdvice {
  shouldNotify: boolean;
  message: string;
  severity: 'none' | 'mild' | 'strong';
}

export function getComfortAdvice(
  temp: number,
  feelsLike: number,
  humidity: number,
  thresholds: { hot: number; cold: number }
): ComfortAdvice {
  // Hot and humid -> suggest cooling
  if (feelsLike >= thresholds.hot && humidity > 55) {
    return {
      shouldNotify: true,
      message: '检测到体感闷热，建议开启空调制冷',
      severity: 'strong'
    };
  }

  if (temp >= thresholds.hot && humidity <= 55) {
    return {
      shouldNotify: true,
      message: '当前温度较高，建议开启空调制冷',
      severity: 'mild'
    };
  }

  // Cold -> suggest heating
  if (feelsLike <= thresholds.cold) {
    return {
      shouldNotify: true,
      message: '检测到温度偏低，建议开启空调制热',
      severity: 'strong'
    };
  }

  return { shouldNotify: false, message: '', severity: 'none' };
}

export function getWeatherIcon(code: number): string {
  // WMO weather codes to emoji
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 59) return '🌧️';
  if (code <= 69) return '❄️';
  if (code <= 79) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  if (code >= 95) return '⛈️';
  return '🌈';
}

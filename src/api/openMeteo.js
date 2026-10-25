import { ApiError, getJSON } from './getJSON.js';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_DAYS = 5;

// Look up a city, then fetch its weather. Returns our own shape:
// { place, current, daily } — components never see the raw API fields.
export async function loadWeather(city, signal) {
  const geoQuery = new URLSearchParams({ name: city, count: 1, language: 'en' });
  const geo = await getJSON(`${GEO_URL}?${geoQuery}`, signal);
  if (!geo.results?.length) {
    throw new ApiError('not-found', `No results for "${city}"`);
  }
  const { latitude, longitude, name, country } = geo.results[0];

  const wxQuery = new URLSearchParams({
    latitude,
    longitude,
    timezone: 'auto',
    forecast_days: FORECAST_DAYS,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  });
  const { current, daily } = await getJSON(`${WEATHER_URL}?${wxQuery}`, signal);

  return {
    place: { name, country: country ?? '' },
    current: {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windKmh: current.wind_speed_10m,
      // API gives local time without a zone; tag it UTC and format it in UTC
      localTime: new Date(`${current.time}Z`),
      ...describe(current.weather_code, current.is_day),
    },
    daily: daily.time.map((day, i) => ({
      date: day, // "2026-10-25" — unique per row, used as the React key
      min: daily.temperature_2m_min[i],
      max: daily.temperature_2m_max[i],
      ...describe(daily.weather_code[i], 1),
    })),
  };
}

// WMO weather code → [description, OpenWeatherMap icon id]
const WMO = {
  0: ['clear sky', '01'],
  1: ['mainly clear', '02'],
  2: ['partly cloudy', '03'],
  3: ['overcast', '04'],
  45: ['fog', '50'],
  48: ['freezing fog', '50'],
  51: ['light drizzle', '09'],
  53: ['drizzle', '09'],
  55: ['heavy drizzle', '09'],
  56: ['freezing drizzle', '09'],
  57: ['freezing drizzle', '09'],
  61: ['light rain', '10'],
  63: ['rain', '10'],
  65: ['heavy rain', '10'],
  66: ['freezing rain', '13'],
  67: ['freezing rain', '13'],
  71: ['light snow', '13'],
  73: ['snow', '13'],
  75: ['heavy snow', '13'],
  77: ['snow grains', '13'],
  80: ['light showers', '09'],
  81: ['showers', '09'],
  82: ['violent showers', '09'],
  85: ['snow showers', '13'],
  86: ['heavy snow showers', '13'],
  95: ['thunderstorm', '11'],
  96: ['thunderstorm with hail', '11'],
  99: ['thunderstorm with hail', '11'],
};

function describe(code, isDay) {
  const [description, icon] = WMO[code] ?? ['unknown', '03'];
  return { description, icon: icon + (isDay ? 'd' : 'n') };
}

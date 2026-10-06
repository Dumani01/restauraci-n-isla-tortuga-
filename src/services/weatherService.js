import { DEFAULT_MAP_CENTER } from './mapService.js';

export const ISLA_TORTUGA = { latitude: DEFAULT_MAP_CENTER.lat, longitude: DEFAULT_MAP_CENTER.lng };
export const WEATHER_CACHE_KEY = 'rc_weather_cache_v1';
export const WEATHER_CACHE_TTL = 20 * 60 * 1000;
export const weatherCodeKeys = { 0: 'clear', 1: 'mainlyClear', 2: 'partlyCloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'drizzle', 53: 'drizzle', 55: 'drizzle', 56: 'drizzle', 57: 'drizzle', 61: 'rain', 63: 'rain', 65: 'rain', 66: 'rain', 67: 'rain', 71: 'snow', 73: 'snow', 75: 'snow', 77: 'snow', 80: 'showers', 81: 'showers', 82: 'showers', 85: 'snow', 86: 'snow', 95: 'thunderstorm', 96: 'thunderstorm', 99: 'thunderstorm' };

const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${ISLA_TORTUGA.latitude}&longitude=${ISLA_TORTUGA.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;

function readCache() {
  try { const cached = JSON.parse(sessionStorage.getItem(WEATHER_CACHE_KEY) || 'null'); return cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL ? cached.data : null; } catch { return null; }
}
function saveCache(data) { try { sessionStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data })); } catch { /* Storage can be unavailable in private browsing. */ } }
function normalize(data) {
  return { current: { temperature: data.current.temperature_2m, apparentTemperature: data.current.apparent_temperature, humidity: data.current.relative_humidity_2m, precipitation: data.current.precipitation, windSpeed: data.current.wind_speed_10m, weatherCode: data.current.weather_code, isDay: Boolean(data.current.is_day), time: data.current.time, units: data.current_units }, forecast: (data.daily?.time || []).map((date, index) => ({ date, temperatureMax: data.daily.temperature_2m_max[index], temperatureMin: data.daily.temperature_2m_min[index], precipitationProbability: data.daily.precipitation_probability_max?.[index], weatherCode: data.daily.weather_code?.[index] })) };
}

export async function getWeather() {
  const cached = readCache(); if (cached) return cached;
  const response = await fetch(endpoint); if (!response.ok) throw new Error(`Weather request failed: ${response.status}`); const data = normalize(await response.json()); saveCache(data); return data;
}
export async function getCurrentWeather() { return (await getWeather()).current; }
export async function getWeatherForecast() { return (await getWeather()).forecast; }

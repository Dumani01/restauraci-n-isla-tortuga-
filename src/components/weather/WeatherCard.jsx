import { useEffect, useMemo, useState } from 'react';
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, RefreshCw, Sun, Thermometer, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getWeather, weatherCodeKeys } from '../../services/weatherService.js';

const icons = { clear: Sun, mainlyClear: CloudSun, partlyCloudy: CloudSun, overcast: Cloud, fog: CloudFog, drizzle: CloudRain, rain: CloudRain, showers: CloudRain, snow: Cloud, thunderstorm: CloudLightning };
function conditionKey(code) { return weatherCodeKeys[code] || 'unknown'; }
function WeatherIcon({ code, size = 24 }) { const Icon = icons[conditionKey(code)] || CloudSun; return <Icon size={size} aria-hidden="true" />; }
function formatDay(date, language) { return new Intl.DateTimeFormat(language, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`)); }

export function WeatherCard() {
  const { t, i18n } = useTranslation(); const [weather, setWeather] = useState(null); const [status, setStatus] = useState('loading');
  const load = () => { setStatus('loading'); getWeather().then((data) => { setWeather(data); setStatus('ready'); }).catch(() => setStatus('error')); };
  useEffect(() => { load(); }, []);
  const currentCondition = useMemo(() => weather ? conditionKey(weather.current.weatherCode) : 'unknown', [weather]);
  if (status === 'loading') return <section className="weather-card weather-card--state" aria-live="polite"><RefreshCw className="weather-spin" size={18} aria-hidden="true" /> <span>{t('weather.loading')}</span></section>;
  if (status === 'error') return <section className="weather-card weather-card--state" role="alert"><Cloud size={20} aria-hidden="true" /><span>{t('weather.error')}</span><button type="button" onClick={load}>{t('weather.retry')}</button></section>;
  const { current, forecast } = weather;
  return <section className="weather-card" aria-labelledby="weather-title"><div className="weather-card__header"><div><p className="weather-eyebrow">{t('weather.current')}</p><h2 id="weather-title">{t('weather.location')}</h2></div><WeatherIcon code={current.weatherCode} size={38} /></div><div className="weather-card__current"><strong>{Math.round(current.temperature)}°</strong><span>{t(`weather.conditions.${currentCondition}`)}</span></div><div className="weather-card__metrics"><span><Thermometer size={15} aria-hidden="true" />{t('weather.feelsLike')}: {Math.round(current.apparentTemperature)}°</span><span><Droplets size={15} aria-hidden="true" />{t('weather.humidity')}: {Math.round(current.humidity)}%</span><span><Wind size={15} aria-hidden="true" />{t('weather.wind')}: {Math.round(current.windSpeed)} km/h</span><span><CloudRain size={15} aria-hidden="true" />{t('weather.precipitation')}: {current.precipitation ?? 0} mm</span></div><p className="weather-card__visit"><b>{t('weather.visitTitle')}:</b> {t('weather.visitInfo')}</p><div className="weather-forecast"><h3>{t('weather.forecast')}</h3><div className="weather-forecast__grid">{forecast.map((day) => <article key={day.date}><span>{formatDay(day.date, i18n.language)}</span><WeatherIcon code={day.weatherCode} size={20} /><strong>{Math.round(day.temperatureMax)}° / {Math.round(day.temperatureMin)}°</strong><small>{day.precipitationProbability ?? 0}% {t('weather.rainShort')}</small></article>)}</div></div></section>;
}

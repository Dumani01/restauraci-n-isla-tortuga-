import { useEffect, useMemo, useState } from 'react';
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { DEFAULT_MAP_CENTER, getMapPoints } from '../../services/mapService.js';
import { MapLegend } from './MapLegend.jsx';
import 'leaflet/dist/leaflet.css';

const filters = ['ALL', 'RESTORATION_ZONE', 'HEALTHY_CORAL', 'SICK_CORAL', 'MONITORING', 'TOURISM', 'ACTIVITY'];
const colors = { RESTORATION_ZONE: '#f2a081', HEALTHY_CORAL: '#8fd8c7', SICK_CORAL: '#e97878', MONITORING: '#f5d477', TOURISM: '#b9a4f5', ACTIVITY: '#8db7f0' };
const typeKey = { RESTORATION_ZONE: 'restorationZone', HEALTHY_CORAL: 'healthyCoral', SICK_CORAL: 'sickCoral', MONITORING: 'monitoring', TOURISM: 'tourism', ACTIVITY: 'activity' };

function MapViewport() { const map = useMap(); useEffect(() => { map.setView([DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng], 12); }, [map]); return null; }
function PointMarker({ point, label, typeLabel }) { const color = colors[point.type] || '#8fd8c7'; return <CircleMarker center={[point.latitude, point.longitude]} radius={9} pathOptions={{ color: '#fff', weight: 2, fillColor: color, fillOpacity: .92 }}><Popup><div className="map-popup"><strong>{point.name}</strong><span>{typeLabel}</span><p><b>{label}:</b> {point.status}</p><p>{point.description}</p><small>Dato demo o de referencia; pendiente de validación.</small></div></Popup></CircleMarker>; }

export function RestorationMap() {
  const { t } = useTranslation(); const [points, setPoints] = useState([]); const [filter, setFilter] = useState('ALL'); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; setLoading(true); getMapPoints().then((data) => { if (active) { setPoints(data); setLoading(false); } }).catch(() => { if (active) { setError(true); setLoading(false); } }); return () => { active = false; }; }, []);
  const visiblePoints = useMemo(() => filter === 'ALL' ? points : points.filter((point) => point.type === filter), [filter, points]);
  return <div className="restoration-map-shell"><div className="map-toolbar"><div className="map-filter-group" role="group" aria-label={t('map.filters')}><label htmlFor="map-filter">{t('map.filter')}</label><select id="map-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>{filters.map((item) => <option key={item} value={item}>{t(`map.filterOptions.${item}`)}</option>)}</select></div><span className="map-point-count" aria-live="polite">{t('map.pointsCount', { count: visiblePoints.length })}</span></div><div className="restoration-map" aria-label={t('map.ariaLabel')}>{loading && <div className="map-state">{t('map.loading')}</div>}{error && <div className="map-state map-state--error" role="alert">{t('map.error')}</div>}{!loading && !error && visiblePoints.length === 0 && <div className="map-state">{t('map.empty')}</div>}<MapContainer center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]} zoom={12} scrollWheelZoom className="leaflet-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapViewport />{visiblePoints.map((point) => <PointMarker key={point.id} point={point} label={t('map.status')} typeLabel={t(`map.types.${typeKey[point.type]}`)} />)}{filter === 'RESTORATION_ZONE' && <Circle center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]} radius={850} pathOptions={{ color: '#f2a081', fillColor: '#f2a081', fillOpacity: .07 }} />}</MapContainer><MapLegend /></div></div>;
}

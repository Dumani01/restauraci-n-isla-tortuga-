import database from '../../db.json';

export const DEFAULT_MAP_CENTER = { lat: 9.755, lng: -84.865 };
export const MAP_POINT_TYPES = ['RESTORATION_ZONE', 'HEALTHY_CORAL', 'SICK_CORAL', 'MONITORING', 'TOURISM', 'ACTIVITY'];

function isValidPoint(point) {
  return point && typeof point.id === 'string' && typeof point.name === 'string' && Number.isFinite(Number(point.latitude)) && Number.isFinite(Number(point.longitude)) && Number(point.latitude) >= -90 && Number(point.latitude) <= 90 && Number(point.longitude) >= -180 && Number(point.longitude) <= 180;
}

export async function getMapPoints() {
  return (database.mapPoints || []).filter(isValidPoint).map((point) => ({ ...point, latitude: Number(point.latitude), longitude: Number(point.longitude) }));
}

export function getMapDataWarnings() {
  return (database.mapPoints || []).filter((point) => !isValidPoint(point)).map((point) => point?.id || 'unknown');
}

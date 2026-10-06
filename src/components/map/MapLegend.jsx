import { useTranslation } from 'react-i18next';

const legendItems = [['RESTORATION_ZONE', 'map.types.restorationZone', '●'], ['HEALTHY_CORAL', 'map.types.healthyCoral', '✓'], ['SICK_CORAL', 'map.types.sickCoral', '!'], ['MONITORING', 'map.types.monitoring', '○'], ['TOURISM', 'map.types.tourism', '★'], ['ACTIVITY', 'map.types.activity', '◆']];

export function MapLegend() {
  const { t } = useTranslation();
  return <aside className="map-legend" aria-label={t('map.legend')}><h3>{t('map.legend')}</h3><ul>{legendItems.map(([type, label, symbol]) => <li key={type}><span className={`map-symbol map-symbol--${type.toLowerCase()}`} aria-hidden="true">{symbol}</span><span>{t(label)}</span></li>)}</ul><p>{t('map.demoNotice')}</p></aside>;
}

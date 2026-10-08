import { Type } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DEFAULT_SCALE = 1;

function getInitialSettings() {
  try {
    const stored = Number(localStorage.getItem('rc_text_scale'));
    return { scale: stored >= 0.85 && stored <= 1.25 ? stored : DEFAULT_SCALE, storageError: false };
  } catch {
    return { scale: DEFAULT_SCALE, storageError: true };
  }
}

export function TextSettings() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(getInitialSettings);
  const { scale, storageError } = settings;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--rc-font-scale', String(scale));
    root.dataset.textScale = String(scale);
    try {
      localStorage.setItem('rc_text_scale', String(scale));
      setSettings((current) => current.storageError ? { ...current, storageError: false } : current);
    } catch {
      setSettings((current) => current.storageError ? current : { ...current, storageError: true });
    }
  }, [scale]);

  return <div className="text-settings" data-text-settings><button className="text-settings__toggle" type="button" aria-expanded={open} aria-controls="text-settings-panel" aria-label={t('common.textSettings', 'Ajustes de texto')} title={t('common.textSettings', 'Ajustes de texto')} onClick={() => setOpen((current) => !current)}><Type size={16} /><span>{t('common.textSettingsShort', 'Texto')}</span></button>{open && <div className="text-settings__panel" id="text-settings-panel"><div className="text-settings__heading"><strong>{t('common.textSettings', 'Ajustes de texto')}</strong><output>{Math.round(scale * 100)}%</output></div><label htmlFor="text-scale-range">{t('common.textSize', 'Tamaño del texto')}</label><input id="text-scale-range" type="range" min="0.85" max="1.25" step="0.05" value={scale} onChange={(event) => setSettings((current) => ({ ...current, scale: Number(event.target.value) }))} /><div className="text-settings__range-labels"><span>A</span><span> A<sup>+</sup></span></div><button className="text-settings__reset" type="button" onClick={() => setSettings((current) => ({ ...current, scale: DEFAULT_SCALE }))}>{t('common.resetText', 'Restablecer')}</button>{storageError && <p role="alert">{t('auth.storageUnavailable')}</p>}</div>}</div>;
}

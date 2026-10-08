import { useState } from 'react';
import { Activity, Bell, Moon, Search, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../components/theme/ThemeProvider.jsx';
import { getObservationRecords, registerObservationRecord } from '../../services/databaseService.js';

const initialForm = { fragment: '', date: '', activity: '', responsible: '', notes: '' };
const activityKeys = {
  collection: 'private.selectCollection',
  nursery: 'private.nursery',
  maintenance: 'private.maintenance',
  monitoring: 'private.monitoring',
};

function readObservations() {
  try {
    return { records: getObservationRecords(), error: '' };
  } catch (error) {
    return { records: [], error: error.message || 'OBSERVATION_STORAGE_READ_FAILED' };
  }
}

export function ObservationsPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [observations, setObservations] = useState(readObservations);
  const [saved, setSaved] = useState(false);
  const { isDark: darkTheme, toggleTheme } = useTheme();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setObservations((current) => ({ ...current, error: '' }));
    setSaved(false);
  };

  const submit = (event) => {
    event.preventDefault();
    setSaved(false);
    try {
      const result = registerObservationRecord(form);
      if (!result.success) {
        setObservations((current) => ({ ...current, error: result.error }));
        return;
      }
      const persisted = getObservationRecords();
      if (!persisted.some((record) => record.id === result.record.id)) {
        throw new Error('OBSERVATION_STORAGE_WRITE_FAILED');
      }
      setObservations({ records: persisted, error: '' });
      setForm(initialForm);
      setSaved(true);
    } catch (error) {
      setObservations((current) => ({ ...current, error: error.message || 'OBSERVATION_STORAGE_WRITE_FAILED' }));
    }
  };

  return <section className={`observation-page${darkTheme ? ' observation-page--dark' : ''}`}>
    <header className="private-section-topbar">
      <div className="private-section-search" aria-hidden="true"><Search size={16} /><span>{t('common.search')}</span><kbd>Ctrl</kbd><kbd>/</kbd></div>
      <div className="private-section-actions">
        <span aria-hidden="true"><Bell size={18} /></span>
        <span aria-hidden="true"><Activity size={18} /></span>
        <button className="private-section-theme-toggle" type="button" aria-label={darkTheme ? t('common.lightTheme') : t('common.darkTheme')} aria-pressed={darkTheme} onClick={toggleTheme}>{darkTheme ? <Sun size={18} /> : <Moon size={18} />}</button>
        <span className="private-section-avatar" aria-hidden="true">RC</span>
      </div>
    </header>
    <nav className="private-section-breadcrumb" aria-label={t('common.breadcrumb')}><Link to="/dashboard">{t('common.home')}</Link><span>/</span><strong>{t('private.recordWork')}</strong></nav>
    <div className="observation-page__content">
      <p className="eyebrow">{t('common.fieldTracking')}</p>
      <h1>{t('private.registerActivity')}</h1>
      <p>{t('private.formIntro')}</p>
      <p className="observation-page__notice" role="note">{t('private.observationDemoNotice', 'Los registros se guardan en este navegador y permanecen pendientes de validación; no son datos de campo verificados.')}</p>
      <form className="panel form" onSubmit={submit}>
        <label>{t('private.fragment')}<input name="fragment" value={form.fragment} onChange={updateField} required /></label>
        <label>{t('private.date')}<input name="date" value={form.date} onChange={updateField} required type="date" /></label>
        <label>{t('private.activity')}<select name="activity" value={form.activity} onChange={updateField} required><option value="">{t('private.selectActivity', 'Selecciona una actividad')}</option>{Object.entries(activityKeys).map(([value, key]) => <option key={value} value={value}>{t(key)}</option>)}</select></label>
        <label>{t('private.responsible')}<input name="responsible" value={form.responsible} onChange={updateField} required /></label>
        <label className="full">{t('private.notes')}<textarea name="notes" value={form.notes} onChange={updateField} /></label>
        {observations.error && <p className="error full" role="alert">{t(`private.observationErrors.${observations.error}`, { defaultValue: t('private.observationStorageError', 'No se pudo guardar o leer el registro. Revisa el almacenamiento de este navegador e inténtalo de nuevo.') })}</p>}
        {saved && <p className="success full" role="status">{t('private.saved')}</p>}
        <button className="button full" type="submit">{t('common.save')}</button>
      </form>
      <section className="observation-records" aria-labelledby="saved-observations-title">
        <h2 id="saved-observations-title">{t('private.savedObservations', 'Registros guardados')} ({observations.records.length})</h2>
        {observations.error
          ? <p>{t(`private.observationErrors.${observations.error}`, { defaultValue: t('private.observationStorageError', 'No se pudo guardar o leer el registro. Revisa el almacenamiento de este navegador e inténtalo de nuevo.') })}</p>
          : observations.records.length === 0
            ? <p>{t('private.noObservations', 'Aún no hay registros guardados en este navegador.')}</p>
            : <ul>{observations.records.map((record) => <li key={record.id}>
              <div><strong>{record.fragment}</strong><span>{record.date} · {t(activityKeys[record.activity] || 'private.activity')}</span></div>
              <p>{record.responsible}</p>
              {record.notes && <p>{record.notes}</p>}
              <small>{t('private.observationDemoBadge', 'Demo · pendiente de validación')}</small>
            </li>)}</ul>}
      </section>
    </div>
  </section>;
}

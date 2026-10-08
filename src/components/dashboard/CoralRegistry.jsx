import { useState } from 'react';
import { Activity, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { addCoralRecord, CoralRegistryError, deleteCoralRecord, getCoralRecords, updateCoralRecord } from '../../services/coralRegistry.js';

function getInitialRegistryState() {
  try {
    return { records: getCoralRecords(), error: '' };
  } catch (cause) {
    return { records: [], error: cause instanceof CoralRegistryError ? cause.code : 'STORAGE_READ_FAILED' };
  }
}

const emptyForm = { identifier: '', status: 'healthy', stage: 'juvenile' };

export function CoralRegistry() {
  const { t } = useTranslation();
  const [registry, setRegistry] = useState(getInitialRegistryState);
  const [form, setForm] = useState(emptyForm);
  const [editingIdentifier, setEditingIdentifier] = useState('');
  const [error, setError] = useState('');

  const refreshRecords = () => setRegistry({ records: getCoralRecords(), error: '' });
  const count = (field, value) => registry.error ? '—' : registry.records.filter((record) => record[field] === value).length;
  const resetForm = () => {
    setForm(emptyForm);
    setEditingIdentifier('');
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    try {
      const result = editingIdentifier
        ? updateCoralRecord(editingIdentifier, { status: form.status, stage: form.stage })
        : addCoralRecord(form);
      if (!result.success) {
        setError(result.error === 'DUPLICATE_IDENTIFIER' ? t('coralRegistry.duplicateError') : t('coralRegistry.recordMissingError'));
        return;
      }
      refreshRecords();
      resetForm();
    } catch (cause) {
      setError(cause instanceof CoralRegistryError ? t(`coralRegistry.${cause.code}`, t('coralRegistry.saveError')) : t('coralRegistry.saveError'));
    }
  };

  const handleDelete = (identifier) => {
    setError('');
    try {
      const result = deleteCoralRecord(identifier);
      if (!result.success) {
        setError(t('coralRegistry.recordMissingError'));
        return;
      }
      refreshRecords();
      if (editingIdentifier === identifier) resetForm();
    } catch (cause) {
      setError(cause instanceof CoralRegistryError ? t(`coralRegistry.${cause.code}`, t('coralRegistry.saveError')) : t('coralRegistry.saveError'));
    }
  };

  const beginEdit = (record) => {
    setEditingIdentifier(record.identifier);
    setForm({ identifier: record.identifier, status: record.status, stage: record.stage });
    setError('');
  };

  return <section className="coral-registry" aria-labelledby="coral-registry-title">
    <header className="coral-registry__header">
      <div>
        <p className="eyebrow"><Activity size={15} /> {t('coralRegistry.kicker')}</p>
        <h2 id="coral-registry-title">{t('coralRegistry.title')}</h2>
        <p>{t('coralRegistry.intro')}</p>
      </div>
      <span className="coral-registry__source">{t('coralRegistry.localData')}</span>
    </header>

    <p className="coral-registry__notice">{t('coralRegistry.notice')}</p>

    <div className="coral-registry__counts" aria-label={t('coralRegistry.counts')}>
      {[
        ['sick', t('coralRegistry.sick'), 'coral-registry__count--sick'],
        ['healthy', t('coralRegistry.healthy'), 'coral-registry__count--healthy'],
        ['treatment', t('coralRegistry.treatment'), 'coral-registry__count--treatment'],
      ].map(([status, label, className]) => <article className={`coral-registry__count ${className}`} key={status}>
        <span>{label}</span><strong data-testid={`coral-count-${status}`}>{count('status', status)}</strong>
      </article>)}
      {[
        ['juvenile', t('coralRegistry.juvenile')],
        ['adult', t('coralRegistry.adult')],
      ].map(([stage, label]) => <article className="coral-registry__count coral-registry__count--stage" key={stage}>
        <span>{label}</span><strong data-testid={`coral-count-${stage}`}>{count('stage', stage)}</strong>
      </article>)}
    </div>

    {registry.error && <p className="coral-registry__error" role="alert">{t(`coralRegistry.${registry.error}`, t('coralRegistry.loadError'))}</p>}

    <div className="coral-registry__layout">
      <form className="coral-registry__form" onSubmit={handleSubmit}>
        <h3>{editingIdentifier ? t('coralRegistry.editTitle') : t('coralRegistry.addTitle')}</h3>
        <label>
          {t('coralRegistry.identifier')}
          <input
            autoComplete="off"
            maxLength={48}
            required
            value={form.identifier}
            disabled={Boolean(editingIdentifier) || Boolean(registry.error)}
            onChange={(event) => setForm({ ...form, identifier: event.target.value })}
          />
        </label>
        <label>
          {t('coralRegistry.status')}
          <select value={form.status} disabled={Boolean(registry.error)} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="healthy">{t('coralRegistry.healthy')}</option>
            <option value="sick">{t('coralRegistry.sick')}</option>
            <option value="treatment">{t('coralRegistry.treatment')}</option>
          </select>
        </label>
        <label>
          {t('coralRegistry.stage')}
          <select value={form.stage} disabled={Boolean(registry.error)} onChange={(event) => setForm({ ...form, stage: event.target.value })}>
            <option value="juvenile">{t('coralRegistry.juvenile')}</option>
            <option value="adult">{t('coralRegistry.adult')}</option>
          </select>
        </label>
        {error && <p className="coral-registry__error" role="alert">{error}</p>}
        <div className="coral-registry__form-actions">
          <button className="coral-registry__save" type="submit" disabled={Boolean(registry.error)}>
            {editingIdentifier ? <Save size={16} /> : <Plus size={16} />}
            {editingIdentifier ? t('coralRegistry.update') : t('coralRegistry.add')}
          </button>
          {editingIdentifier && <button className="coral-registry__cancel" type="button" onClick={resetForm}><X size={16} />{t('coralRegistry.cancel')}</button>}
        </div>
      </form>

      <div className="coral-registry__list">
        <h3>{t('coralRegistry.listTitle')} <span>{registry.error ? '—' : registry.records.length}</span></h3>
        {registry.records.length === 0 && !registry.error
          ? <p className="coral-registry__empty">{t('coralRegistry.empty')}</p>
          : !registry.error && <div className="coral-registry__table-wrap">
            <table>
              <thead><tr>
                <th>{t('coralRegistry.identifier')}</th>
                <th>{t('coralRegistry.status')}</th>
                <th>{t('coralRegistry.stage')}</th>
                <th><span className="sr-only">{t('coralRegistry.actions')}</span></th>
              </tr></thead>
              <tbody>{registry.records.map((record) => <tr key={record.identifier}>
                <th scope="row">{record.identifier}</th>
                <td><span className={`coral-registry__tag coral-registry__tag--${record.status}`}>{t(`coralRegistry.${record.status}`)}</span></td>
                <td>{t(`coralRegistry.${record.stage}`)}</td>
                <td className="coral-registry__row-actions">
                  <button type="button" aria-label={`${t('coralRegistry.edit')} ${record.identifier}`} onClick={() => beginEdit(record)}><Pencil size={15} /></button>
                  <button type="button" aria-label={`${t('coralRegistry.delete')} ${record.identifier}`} onClick={() => handleDelete(record.identifier)}><Trash2 size={15} /></button>
                </td>
              </tr>)}</tbody>
            </table>
          </div>}
      </div>
    </div>
  </section>;
}

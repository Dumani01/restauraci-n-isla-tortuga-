export const CORAL_STATUSES = ['Vivo', 'Enfermo', 'Blanqueado', 'Perdido', 'Pendiente de siembra', 'En observación'];
export const STRUCTURE_CONDITIONS = ['Estable', 'Desplazada', 'Dañada', 'Enterrada', 'Requiere mantenimiento'];
export const VALIDATION_STATUSES = ['Pendiente', 'Preliminar', 'Revisada', 'Validada'];

export function getDataProvenance(record = {}) {
  return {
    source: record.source || 'Dato demo',
    validation: record.validation || 'Pendiente',
    evidence: record.evidence || 'Sin evidencia adjunta'
  };
}

export function summarizeObservation(observation = {}) {
  const fields = [
    ['coralId', 'coral'],
    ['zoneId', 'zona'],
    ['visitDate', 'fecha de visita'],
    ['observerId', 'responsable'],
    ['status', 'estado']
  ];
  const missing = fields.filter(([field]) => !observation[field]).map(([, label]) => label);
  const present = fields.filter(([field]) => observation[field]).map(([, label]) => label);
  const summary = present.length ? `Registro recibido con ${present.join(', ')}.` : 'No se recibieron campos suficientes para resumir.';
  return {
    summary,
    missing,
    disclaimer: 'Resumen de campos recibidos; no es un diagnóstico ni una recomendación biológica.'
  };
}

export function validateObservation(observation) {
  const required = ['coralId', 'zoneId', 'visitDate', 'observerId', 'status'];
  const missing = required.filter((field) => !observation?.[field]);
  if (observation?.status === 'Enfermo' && Number(observation?.evidenceCount || 0) < 1) missing.push('evidenceCount');
  return { valid: missing.length === 0, missing: [...new Set(missing)] };
}

export function getLatestObservations(observations = []) {
  const latest = new Map();
  [...observations].sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate)).forEach((item) => {
    if (!latest.has(item.coralId)) latest.set(item.coralId, item);
  });
  return [...latest.values()];
}

export function calculateIndicators({ corals = [], observations = [], structures = [], activities = [] } = {}) {
  const latest = new Map(getLatestObservations(observations).map((item) => [item.coralId, item]));
  const statusOf = (coral) => latest.get(coral.id)?.status || coral.status;
  const planted = corals.filter((coral) => coral.plantedAt).length;
  const alive = corals.filter((coral) => statusOf(coral) === 'Vivo').length;
  return {
    liveCorals: corals.filter((coral) => statusOf(coral) === 'Vivo').length,
    sickCorals: corals.filter((coral) => ['Enfermo', 'Blanqueado'].includes(statusOf(coral))).length,
    pendingPlanting: corals.filter((coral) => statusOf(coral) === 'Pendiente de siembra').length,
    lostCorals: corals.filter((coral) => statusOf(coral) === 'Perdido').length,
    stableStructures: structures.filter((item) => item.condition === 'Estable').length,
    pendingData: observations.filter((item) => item.validation !== 'Validada' || Number(item.evidenceCount || 0) < 1).length,
    validatedObservations: observations.filter((item) => item.validation === 'Validada').length,
    survivalRate: planted ? Math.round((alive / planted) * 100) : null,
    activities: activities.length
  };
}

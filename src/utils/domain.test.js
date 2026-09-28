import { calculateIndicators, getDataProvenance, summarizeObservation, validateObservation } from './domain';

test('valida una observación mínima', () => {
  expect(validateObservation({ coralId: 'c1', zoneId: 'z1', visitDate: '2026-09-20', observerId: 'u2', status: 'Vivo' }).valid).toBe(true);
});

test('exige evidencia para un coral enfermo', () => {
  const result = validateObservation({ coralId: 'c1', zoneId: 'z1', visitDate: '2026-09-20', observerId: 'u2', status: 'Enfermo', evidenceCount: 0 });
  expect(result.valid).toBe(false);
  expect(result.missing).toContain('evidenceCount');
});

test('calcula indicadores desde los datos registrados', () => {
  const result = calculateIndicators({
    corals: [{ id: 'c1', status: 'Vivo', plantedAt: '2026-06-01' }, { id: 'c2', status: 'Pendiente de siembra' }],
    observations: [{ coralId: 'c1', status: 'Vivo', visitDate: '2026-09-20', validation: 'Validada', evidenceCount: 1 }],
    structures: [{ condition: 'Estable' }],
    activities: [{}]
  });
  expect(result.liveCorals).toBe(1);
  expect(result.pendingPlanting).toBe(1);
  expect(result.survivalRate).toBe(100);
  expect(result.activities).toBe(1);
});

test('expone la trazabilidad minima de un registro', () => {
  expect(getDataProvenance({}).source).toBe('Dato demo');
  expect(getDataProvenance({ validation: 'Revisada', evidence: 'Foto demo' })).toEqual({
    source: 'Dato demo',
    validation: 'Revisada',
    evidence: 'Foto demo'
  });
});

test('resume campos recibidos sin diagnosticar', () => {
  const result = summarizeObservation({ coralId: 'c1', status: 'Vivo' });
  expect(result.summary).toContain('coral');
  expect(result.missing).toContain('zona');
  expect(result.disclaimer).toContain('no es un diagnóstico');
});

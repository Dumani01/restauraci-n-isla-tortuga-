import { findUserByCredentials, getDemoUserRecords, getEvidenceRecords, getLifecycleStageRecords, getMapPointRecords, getObservationRecords, getProjectRecord, getUserRecords, registerObservationRecord } from './databaseService.js';
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.removeItem('rc_registered_users');
  localStorage.removeItem('rc_observations');
});

test('expone las colecciones de db.json sin compartir referencias mutables', () => {
  expect(getProjectRecord().location).toContain('Isla Tortuga');
  expect(getLifecycleStageRecords()).toHaveLength(6);
  expect(getMapPointRecords()).toHaveLength(4);
  expect(getObservationRecords()).toEqual([]);
  expect(getEvidenceRecords()).toEqual([]);
  expect(getUserRecords()).toHaveLength(3);
  expect(getDemoUserRecords()).toHaveLength(3);
});

test('encuentra los perfiles demo por correo y contraseña', () => {
  expect(findUserByCredentials('admin@restauracioncoralina.demo', 'DemoAdmin2026!')).toMatchObject({ role: 'ADMIN', demo: true });
  expect(findUserByCredentials('COORDINACION@RESTAURACIONCORALINA.DEMO', 'DemoCoord2026!')).toMatchObject({ role: 'MODERATOR' });
  expect(findUserByCredentials('visitante@restauracioncoralina.demo', 'incorrecta')).toBeNull();
});

test('persiste observaciones validadas y las recupera como datos demo sin verificar', () => {
  const result = registerObservationRecord({
    date: '2026-10-08',
    activity: 'monitoring',
    responsible: 'Equipo demo',
    fragment: 'Registro local 01',
    notes: 'Nota de prueba',
  });

  expect(result.success).toBe(true);
  expect(result.record).toMatchObject({
    date: '2026-10-08',
    activity: 'monitoring',
    responsible: 'Equipo demo',
    fragment: 'Registro local 01',
    notes: 'Nota de prueba',
    dataStatus: 'DEMO',
    verified: false,
  });
  expect(getObservationRecords()).toEqual([result.record]);
  expect(JSON.parse(localStorage.getItem('rc_observations'))).toEqual([result.record]);
});

test('rechaza observaciones incompletas o con actividad no admitida', () => {
  expect(registerObservationRecord({ date: '', activity: 'monitoring', responsible: 'Equipo', fragment: 'F-1' }))
    .toEqual({ success: false, error: 'INVALID_INPUT' });
  expect(registerObservationRecord({ date: '2026-10-08', activity: 'diagnosis', responsible: 'Equipo', fragment: 'F-1' }))
    .toEqual({ success: false, error: 'INVALID_ACTIVITY' });
  expect(getObservationRecords()).toEqual([]);
});

test('reporta almacenamiento ilegible sin confirmar escrituras', () => {
  localStorage.setItem('rc_observations', '{invalid');

  expect(() => getObservationRecords()).toThrow('OBSERVATION_STORAGE_READ_FAILED');
  expect(() => registerObservationRecord({ date: '2026-10-08', activity: 'monitoring', responsible: 'Equipo', fragment: 'F-1' }))
    .toThrow('OBSERVATION_STORAGE_READ_FAILED');
});

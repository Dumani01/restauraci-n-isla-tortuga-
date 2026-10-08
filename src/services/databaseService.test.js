import { findUserByCredentials, getDemoUserRecords, getEvidenceRecords, getLifecycleStageRecords, getMapPointRecords, getObservationRecords, getProjectRecord, getUserRecords } from './databaseService.js';
import { beforeEach } from 'vitest';

beforeEach(() => localStorage.removeItem('rc_registered_users'));

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

import { getEvidenceRecords, getLifecycleStageRecords, getMapPointRecords, getObservationRecords, getProjectRecord, getUserRecords } from './databaseService.js';

test('expone las colecciones de db.json sin compartir referencias mutables', () => {
  expect(getProjectRecord().location).toContain('Isla Tortuga');
  expect(getLifecycleStageRecords()).toHaveLength(6);
  expect(getMapPointRecords()).toHaveLength(4);
  expect(getObservationRecords()).toEqual([]);
  expect(getEvidenceRecords()).toEqual([]);
  expect(getUserRecords()).toEqual([]);
});

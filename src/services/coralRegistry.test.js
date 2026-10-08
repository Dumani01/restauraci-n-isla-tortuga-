import { beforeEach, describe, expect, test } from 'vitest';
import { addCoralRecord, deleteCoralRecord, getCoralRecords, updateCoralRecord } from './coralRegistry.js';

describe('coral registry', () => {
  beforeEach(() => localStorage.clear());

  test('adds coral entries and rejects duplicate identifiers without regard to case', () => {
    expect(addCoralRecord({ identifier: 'C-01', status: 'healthy', stage: 'juvenile' }).success).toBe(true);
    expect(addCoralRecord({ identifier: ' c-01 ', status: 'sick', stage: 'adult' })).toEqual({ success: false, error: 'DUPLICATE_IDENTIFIER' });
    expect(getCoralRecords()).toMatchObject([{ identifier: 'C-01', status: 'healthy', stage: 'juvenile' }]);
  });

  test('updates and deletes one coral by identifier', () => {
    addCoralRecord({ identifier: 'C-02', status: 'healthy', stage: 'juvenile' });

    expect(updateCoralRecord('c-02', { status: 'treatment', stage: 'adult' }).record).toMatchObject({ status: 'treatment', stage: 'adult' });
    expect(deleteCoralRecord('C-02')).toEqual({ success: true });
    expect(getCoralRecords()).toEqual([]);
  });

  test('rejects statuses and stages outside the supported options', () => {
    expect(() => addCoralRecord({ identifier: 'C-03', status: 'unknown', stage: 'adult' })).toThrow();
    expect(() => addCoralRecord({ identifier: 'C-03', status: 'healthy', stage: 'larva' })).toThrow();
  });
});

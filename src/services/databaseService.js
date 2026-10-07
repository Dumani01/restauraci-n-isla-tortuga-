import database from '../../db.json';

const emptyDatabase = { project: {}, lifecycleStages: [], observations: [], evidence: [], users: [], mapPoints: [] };

export function getDatabaseSnapshot() {
  return database || emptyDatabase;
}

export function getProjectRecord() {
  return { ...(getDatabaseSnapshot().project || {}) };
}

export function getLifecycleStageRecords() {
  return [...(getDatabaseSnapshot().lifecycleStages || [])];
}

export function getObservationRecords() {
  return [...(getDatabaseSnapshot().observations || [])];
}

export function getEvidenceRecords() {
  return [...(getDatabaseSnapshot().evidence || [])];
}

export function getUserRecords() {
  return [...(getDatabaseSnapshot().users || [])];
}

export function getMapPointRecords() {
  return [...(getDatabaseSnapshot().mapPoints || [])];
}

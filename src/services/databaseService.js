import database from '../../db.json';

const emptyDatabase = { project: {}, lifecycleStages: [], observations: [], evidence: [], users: [], mapPoints: [] };
const registeredUsersKey = 'rc_registered_users';

function getStoredRegisteredUsers() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const stored = JSON.parse(localStorage.getItem(registeredUsersKey) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

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
  return [...(getDatabaseSnapshot().users || []), ...getStoredRegisteredUsers()];
}

export function getDemoUserRecords() {
  return getUserRecords().filter((user) => user.demo === true);
}

export function getRegisteredUserRecords() {
  return getStoredRegisteredUsers();
}

export function registerUserRecord(user) {
  const email = String(user?.email || '').trim().toLowerCase();
  if (!email || getUserRecords().some((record) => record.email?.toLowerCase() === email)) return { success: false, error: 'EMAIL_EXISTS' };
  const record = { ...user, id: user.id || `local-user-${Date.now()}`, email, demo: false, createdAt: user.createdAt || new Date().toISOString() };
  const nextRecords = [...getStoredRegisteredUsers(), record];
  localStorage.setItem(registeredUsersKey, JSON.stringify(nextRecords));
  return { success: true, record };
}

export function findUserByCredentials(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return getUserRecords().find((user) => user.email?.toLowerCase() === normalizedEmail && user.password === password) || null;
}

export function getMapPointRecords() {
  return [...(getDatabaseSnapshot().mapPoints || [])];
}

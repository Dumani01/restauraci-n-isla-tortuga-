const storageKey = 'rc_coral_registry';
const statuses = ['healthy', 'sick', 'treatment'];
const stages = ['juvenile', 'adult'];

export class CoralRegistryError extends Error {
  constructor(code) {
    super(code);
    this.name = 'CoralRegistryError';
    this.code = code;
  }
}

function normalizeIdentifier(identifier) {
  return String(identifier || '').trim().toLocaleLowerCase();
}

function validateEntry({ identifier, status, stage }) {
  if (!normalizeIdentifier(identifier)) throw new CoralRegistryError('INVALID_IDENTIFIER');
  if (!statuses.includes(status)) throw new CoralRegistryError('INVALID_STATUS');
  if (!stages.includes(stage)) throw new CoralRegistryError('INVALID_STAGE');
}

export function getCoralRecords() {
  let stored;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    throw new CoralRegistryError('STORAGE_READ_FAILED');
  }
  if (!stored) return [];

  let records;
  try {
    records = JSON.parse(stored);
  } catch {
    throw new CoralRegistryError('STORAGE_INVALID');
  }
  if (!Array.isArray(records) || records.some((record) => {
    try {
      validateEntry(record);
      return false;
    } catch {
      return true;
    }
  })) {
    throw new CoralRegistryError('STORAGE_INVALID');
  }
  const identifiers = records.map((record) => normalizeIdentifier(record.identifier));
  if (new Set(identifiers).size !== identifiers.length) {
    throw new CoralRegistryError('STORAGE_INVALID');
  }
  return records;
}

function storeRecords(records) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    throw new CoralRegistryError('STORAGE_WRITE_FAILED');
  }
}

export function addCoralRecord(entry) {
  validateEntry(entry);
  const records = getCoralRecords();
  const identifier = String(entry.identifier).trim();
  if (records.some((record) => normalizeIdentifier(record.identifier) === normalizeIdentifier(identifier))) {
    return { success: false, error: 'DUPLICATE_IDENTIFIER' };
  }
  const now = new Date().toISOString();
  const record = { identifier, status: entry.status, stage: entry.stage, createdAt: now, updatedAt: now };
  storeRecords([...records, record]);
  return { success: true, record };
}

export function updateCoralRecord(identifier, updates) {
  validateEntry({ identifier, ...updates });
  const records = getCoralRecords();
  const index = records.findIndex((record) => normalizeIdentifier(record.identifier) === normalizeIdentifier(identifier));
  if (index < 0) return { success: false, error: 'RECORD_NOT_FOUND' };
  const nextRecords = [...records];
  nextRecords[index] = { ...nextRecords[index], status: updates.status, stage: updates.stage, updatedAt: new Date().toISOString() };
  storeRecords(nextRecords);
  return { success: true, record: nextRecords[index] };
}

export function deleteCoralRecord(identifier) {
  const records = getCoralRecords();
  const nextRecords = records.filter((record) => normalizeIdentifier(record.identifier) !== normalizeIdentifier(identifier));
  if (nextRecords.length === records.length) return { success: false, error: 'RECORD_NOT_FOUND' };
  storeRecords(nextRecords);
  return { success: true };
}

import database from "../../db.json";

const emptyDatabase = {
  project: {},
  lifecycleStages: [],
  observations: [],
  evidence: [],
  users: [],
  mapPoints: [],
};
const registeredUsersKey = "rc_registered_users";
const observationsKey = "rc_observations";
const observationActivities = [
  "collection",
  "nursery",
  "maintenance",
  "monitoring",
];

function readStoredRecords(key, errorCode) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    const records = JSON.parse(stored);
    if (!Array.isArray(records)) throw new Error("INVALID_COLLECTION");
    return records;
  } catch (error) {
    throw new Error(errorCode, { cause: error });
  }
}

function getStoredRegisteredUsers() {
  if (typeof localStorage === "undefined")
    throw new Error("USER_STORAGE_UNAVAILABLE");
  const records = readStoredRecords(
    registeredUsersKey,
    "USER_STORAGE_READ_FAILED",
  );
  const roles = ["ADMIN", "MODERATOR", "USER"];
  if (
    records.some(
      (record) =>
        !record ||
        typeof record.id !== "string" ||
        typeof record.name !== "string" ||
        typeof record.email !== "string" ||
        typeof record.password !== "string" ||
        !roles.includes(record.role),
    )
  ) {
    throw new Error("USER_STORAGE_INVALID");
  }
  return records;
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
  return [
    ...(getDatabaseSnapshot().observations || []),
    ...readStoredRecords(observationsKey, "OBSERVATION_STORAGE_READ_FAILED"),
  ];
}

export function registerObservationRecord(observation) {
  const requiredFields = ["date", "activity", "responsible", "fragment"];
  const invalid = requiredFields.some(
    (field) =>
      typeof observation?.[field] !== "string" || !observation[field].trim(),
  );
  if (invalid) return { success: false, error: "INVALID_INPUT" };
  if (!observationActivities.includes(observation.activity))
    return { success: false, error: "INVALID_ACTIVITY" };
  if (typeof localStorage === "undefined")
    throw new Error("OBSERVATION_STORAGE_UNAVAILABLE");

  const record = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `observation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    date: observation.date.trim(),
    activity: observation.activity,
    responsible: observation.responsible.trim(),
    fragment: observation.fragment.trim(),
    notes:
      typeof observation.notes === "string" ? observation.notes.trim() : "",
    dataStatus: "DEMO",
    verified: false,
    createdAt: new Date().toISOString(),
  };
  const existing = readStoredRecords(
    observationsKey,
    "OBSERVATION_STORAGE_READ_FAILED",
  );
  try {
    localStorage.setItem(
      observationsKey,
      JSON.stringify([...existing, record]),
    );
  } catch (error) {
    throw new Error("OBSERVATION_STORAGE_WRITE_FAILED", { cause: error });
  }
  return { success: true, record };
}

export function getEvidenceRecords() {
  return [...(getDatabaseSnapshot().evidence || [])];
}

export function getUserRecords() {
  return [
    ...(getDatabaseSnapshot().users || []),
    ...getStoredRegisteredUsers(),
  ];
}

export function getDemoUserRecords() {
  return getUserRecords().filter((user) => user.demo === true);
}

export function getRegisteredUserRecords() {
  return getStoredRegisteredUsers();
}

export function registerUserRecord(user) {
  const email = String(user?.email || "")
    .trim()
    .toLowerCase();
  const role = user?.role;
  if (!["ADMIN", "MODERATOR", "USER"].includes(role))
    return { success: false, error: "INVALID_ROLE" };
  if (
    !String(user?.name || "").trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    String(user?.password || "").length < 8
  ) {
    return { success: false, error: "INVALID_USER" };
  }
  if (getUserRecords().some((record) => record.email?.toLowerCase() === email))
    return { success: false, error: "EMAIL_EXISTS" };
  const record = {
    id: `local-user-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`}`,
    name: user.name.trim(),
    email,
    password: user.password,
    role,
    profile:
      role === "ADMIN"
        ? "Administrador"
        : role === "MODERATOR"
          ? "Coordinador"
          : "Colaborador",
    description:
      typeof user.description === "string" ? user.description.trim() : "",
    demo: false,
    createdAt: new Date().toISOString(),
  };
  const nextRecords = [...getStoredRegisteredUsers(), record];
  try {
    localStorage.setItem(registeredUsersKey, JSON.stringify(nextRecords));
  } catch (error) {
    throw new Error("USER_STORAGE_WRITE_FAILED", { cause: error });
  }
  return { success: true, record };
}

export function findUserByCredentials(email, password) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  return (
    getUserRecords().find(
      (user) =>
        user.email?.toLowerCase() === normalizedEmail &&
        user.password === password,
    ) || null
  );
}

export function findUserForSession(session) {
  if (
    !session ||
    typeof session !== "object" ||
    typeof session.id !== "string" ||
    typeof session.email !== "string" ||
    !["ADMIN", "MODERATOR", "USER"].includes(session.role)
  )
    return null;
  const normalizedEmail = session.email.trim().toLowerCase();
  const record = getUserRecords().find(
    (user) =>
      user.id === session.id && user.email.toLowerCase() === normalizedEmail,
  );
  if (!record || record.role !== session.role) return null;
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    profile: record.profile,
    demo: record.demo === true,
  };
}

export function getMapPointRecords() {
  return [...(getDatabaseSnapshot().mapPoints || [])];
}

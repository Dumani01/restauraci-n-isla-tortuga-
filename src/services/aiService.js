const supportedLanguages = ['es', 'en', 'fr', 'de', 'pt'];
const maxMessageLength = 2000;
export const AI_TIMEOUT_MS = 30000;

function getRequestId() { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID(); return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
function getWebhookUrl() { return import.meta.env.VITE_N8N_AI_WEBHOOK_URL?.trim() || ''; }
function normalizePayload(payload = {}) {
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const language = supportedLanguages.includes(payload.language) ? payload.language : 'es';
  const allowedRoles = ['USER', 'MODERATOR', 'ADMIN']; const role = allowedRoles.includes(payload.role) ? payload.role : 'USER';
  const context = payload.context && typeof payload.context === 'object' ? { page: typeof payload.context.page === 'string' ? payload.context.page.slice(0, 80) : undefined, restorationZoneId: typeof payload.context.restorationZoneId === 'string' ? payload.context.restorationZoneId.slice(0, 120) : undefined } : undefined;
  return { message, language, role, ...(context ? { context } : {}) };
}

export function validateAiRequest(payload = {}) {
  const normalized = normalizePayload(payload); if (!normalized.message) return { valid: false, error: 'INVALID_INPUT', payload: normalized }; if (normalized.message.length > maxMessageLength) return { valid: false, error: 'INVALID_INPUT', payload: normalized }; return { valid: true, payload: normalized };
}
function normalizeResponse(body, requestId) {
  if (!body || typeof body !== 'object' || typeof body.success !== 'boolean' || (body.success && typeof body.answer !== 'string')) throw new Error('INVALID_RESPONSE');
  return { success: body.success, answer: body.answer || '', requestId: body.requestId || requestId, sources: Array.isArray(body.sources) ? body.sources : [], ...(body.error ? { error: body.error } : {}) };
}

export async function askAssistant(payload, options = {}) {
  const validation = validateAiRequest(payload); if (!validation.valid) return { success: false, answer: '', requestId: getRequestId(), error: validation.error };
  const webhookUrl = getWebhookUrl(); if (!webhookUrl) return { success: false, answer: '', requestId: getRequestId(), error: 'N8N_UNAVAILABLE' };
  const requestId = getRequestId(); const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), options.timeout ?? AI_TIMEOUT_MS); if (options.signal) { if (options.signal.aborted) controller.abort(); else options.signal.addEventListener('abort', () => controller.abort(), { once: true }); }
  try {
    const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId }, body: JSON.stringify({ ...validation.payload, requestId }), signal: controller.signal });
    if (!response.ok) { if (response.status === 429) return { success: false, answer: '', requestId, error: 'RATE_LIMIT' }; return { success: false, answer: '', requestId, error: 'AI_SERVICE_UNAVAILABLE' }; }
    return normalizeResponse(await response.json(), requestId);
  } catch (error) { return { success: false, answer: '', requestId, error: error?.name === 'AbortError' ? 'AI_TIMEOUT' : 'N8N_UNAVAILABLE' }; } finally { clearTimeout(timeout); }
}

export { maxMessageLength, supportedLanguages };

const supportedLanguages = ['es', 'en', 'fr', 'de', 'pt'];
const maxMessageLength = 2000;
export const AI_TIMEOUT_MS = 30000;

function getRequestId() { if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID(); return `req-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
function getWebhookUrl() { return import.meta.env.VITE_N8N_AI_WEBHOOK_URL?.trim() || ''; }
function normalizePayload(payload = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const message = typeof source.message === 'string' ? source.message.trim() : '';
  const language = supportedLanguages.includes(source.language) ? source.language : 'es';
  const context = source.context && typeof source.context === 'object' && !Array.isArray(source.context)
    ? { page: typeof source.context.page === 'string' ? source.context.page.slice(0, 80) : undefined }
    : undefined;
  return { message, language, ...(context ? { context } : {}) };
}

export function validateAiRequest(payload = {}) {
  const normalized = normalizePayload(payload);
  if (!normalized.message || normalized.message.length > maxMessageLength) return { valid: false, error: 'INVALID_INPUT', payload: normalized };
  return { valid: true, payload: normalized };
}
function normalizeResponse(body, requestId) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.success !== 'boolean') throw new Error('INVALID_RESPONSE');
  if (body.success && (typeof body.answer !== 'string' || !body.answer.trim())) throw new Error('INVALID_RESPONSE');
  if (!body.success && typeof body.error !== 'string') throw new Error('INVALID_RESPONSE');
  if (body.requestId !== undefined && typeof body.requestId !== 'string') throw new Error('INVALID_RESPONSE');
  if (body.sources !== undefined && !Array.isArray(body.sources)) throw new Error('INVALID_RESPONSE');
  return { success: body.success, answer: body.success ? body.answer : '', requestId: body.requestId || requestId, sources: body.sources || [], ...(body.error ? { error: body.error } : {}) };
}

export async function askAssistant(payload, options = {}) {
  const validation = validateAiRequest(payload); if (!validation.valid) return { success: false, answer: '', requestId: getRequestId(), error: validation.error };
  const webhookUrl = getWebhookUrl(); if (!webhookUrl) return { success: false, answer: '', requestId: getRequestId(), error: 'N8N_UNAVAILABLE' };
  const requestId = getRequestId();
  const controller = new AbortController();
  let timedOut = false;
  const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, options.timeout ?? AI_TIMEOUT_MS);
  const abortRequest = () => controller.abort();
  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else options.signal.addEventListener('abort', abortRequest, { once: true });
  }
  try {
    const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Request-Id': requestId }, body: JSON.stringify({ ...validation.payload, requestId }), signal: controller.signal });
    if (!response.ok) { if (response.status === 404) return { success: false, answer: '', requestId, error: 'N8N_UNAVAILABLE' }; if (response.status === 429) return { success: false, answer: '', requestId, error: 'RATE_LIMIT' }; return { success: false, answer: '', requestId, error: 'AI_SERVICE_UNAVAILABLE' }; }
    let body;
    try {
      body = await response.json();
    } catch {
      return { success: false, answer: '', requestId, error: 'AI_INVALID_RESPONSE' };
    }
    try {
      return normalizeResponse(body, requestId);
    } catch {
      return { success: false, answer: '', requestId, error: 'AI_INVALID_RESPONSE' };
    }
  } catch (error) {
    return { success: false, answer: '', requestId, error: timedOut ? 'AI_TIMEOUT' : error?.name === 'AbortError' ? 'REQUEST_CANCELLED' : 'N8N_UNAVAILABLE' };
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortRequest);
  }
}

export { maxMessageLength, supportedLanguages };

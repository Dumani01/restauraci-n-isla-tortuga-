import { afterEach, describe, expect, test, vi } from "vitest";
import { askAssistant, validateAiRequest } from "./aiService.js";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("aiService", () => {
  test("valida el texto y omite datos de rol no confiables del payload", () => {
    expect(
      validateAiRequest({
        message: "  ¿Qué es la restauración coralina?  ",
        language: "en",
        role: "ADMIN",
        context: {
          page: "restoration",
          restorationZoneId: "private",
          ignored: true,
        },
      }),
    ).toEqual({
      valid: true,
      payload: {
        message: "¿Qué es la restauración coralina?",
        language: "en",
        context: { page: "restoration" },
      },
    });
    expect(validateAiRequest({ message: "" }).error).toBe("INVALID_INPUT");
    expect(validateAiRequest({ message: "a".repeat(2001) }).error).toBe(
      "INVALID_INPUT",
    );
  });

  test("devuelve error controlado si no hay webhook configurado", async () => {
    const response = await askAssistant({ message: "Consulta demo" });
    expect(response).toMatchObject({
      success: false,
      error: "N8N_UNAVAILABLE",
    });
  });

  test("envía un contrato sin rol de navegador y valida la respuesta", async () => {
    vi.stubEnv("VITE_N8N_AI_WEBHOOK_URL", "https://example.test/webhook");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        answer: "Respuesta controlada",
        requestId: "n8n-1",
        sources: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const result = await askAssistant({ message: "consulta", role: "ADMIN" });
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent).toMatchObject({ message: "consulta", language: "es" });
    expect(sent).not.toHaveProperty("role");
    expect(result).toMatchObject({
      success: true,
      answer: "Respuesta controlada",
      requestId: "n8n-1",
    });
  });

  test.each([
    [404, "N8N_UNAVAILABLE"],
    [429, "RATE_LIMIT"],
    [500, "AI_SERVICE_UNAVAILABLE"],
  ])("maneja HTTP %s como %s", async (status, error) => {
    vi.stubEnv("VITE_N8N_AI_WEBHOOK_URL", "https://example.test/webhook");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status }));
    await expect(askAssistant({ message: "consulta" })).resolves.toMatchObject({
      success: false,
      error,
    });
  });

  test("rechaza JSON y contratos de respuesta inválidos", async () => {
    vi.stubEnv("VITE_N8N_AI_WEBHOOK_URL", "https://example.test/webhook");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => {
            throw new SyntaxError("invalid json");
          },
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, answer: "" }),
        }),
    );
    await expect(askAssistant({ message: "consulta" })).resolves.toMatchObject({
      error: "AI_INVALID_RESPONSE",
    });
    await expect(askAssistant({ message: "consulta" })).resolves.toMatchObject({
      error: "AI_INVALID_RESPONSE",
    });
  });

  test("distingue el timeout del servicio caído", async () => {
    vi.useFakeTimers();
    vi.stubEnv("VITE_N8N_AI_WEBHOOK_URL", "https://example.test/webhook");
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, { signal }) =>
          new Promise((_, reject) => {
            signal.addEventListener(
              "abort",
              () => reject(new DOMException("Aborted", "AbortError")),
              { once: true },
            );
          }),
      ),
    );
    const pending = askAssistant({ message: "consulta" }, { timeout: 10 });
    await vi.advanceTimersByTimeAsync(10);
    await expect(pending).resolves.toMatchObject({
      success: false,
      error: "AI_TIMEOUT",
    });
  });
});

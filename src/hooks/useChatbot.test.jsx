import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import "../i18n/index.js";
import { useChatbot } from "./useChatbot.jsx";

const { askAssistant } = vi.hoisted(() => ({ askAssistant: vi.fn() }));
vi.mock("../services/aiService.js", () => ({ askAssistant }));

describe("useChatbot identity isolation", () => {
  beforeEach(() => {
    sessionStorage.clear();
    askAssistant.mockReset();
  });

  test("keeps each identity history in its own session storage entry", async () => {
    askAssistant.mockResolvedValue({
      success: true,
      answer: "Respuesta demo",
      requestId: "response-1",
    });
    const { result, rerender } = renderHook(
      ({ user }) => useChatbot({ pathname: "/", user }),
      {
        initialProps: { user: { id: "demo-a" } },
      },
    );

    await act(async () => {
      await result.current.sendMessage("Mensaje A");
    });
    expect(sessionStorage.getItem("rc_chat_history:demo-a")).toContain(
      "Mensaje A",
    );

    rerender({ user: { id: "demo-b" } });
    await waitFor(() =>
      expect(
        result.current.messages.some(({ content }) => content === "Mensaje A"),
      ).toBe(false),
    );
    await act(async () => {
      await result.current.sendMessage("Mensaje B");
    });
    expect(sessionStorage.getItem("rc_chat_history:demo-b")).toContain(
      "Mensaje B",
    );
    expect(sessionStorage.getItem("rc_chat_history:demo-b")).not.toContain(
      "Mensaje A",
    );

    rerender({ user: { id: "demo-a" } });
    await waitFor(() =>
      expect(
        result.current.messages.some(({ content }) => content === "Mensaje A"),
      ).toBe(true),
    );
    expect(
      result.current.messages.some(({ content }) => content === "Mensaje B"),
    ).toBe(false);
  });

  test("aborts and invalidates an outstanding response when identity changes", async () => {
    let signal;
    askAssistant.mockImplementation((_payload, options) => {
      signal = options.signal;
      return new Promise((resolve) =>
        signal.addEventListener(
          "abort",
          () =>
            resolve({
              success: true,
              answer: "Respuesta tardía",
              requestId: "late",
            }),
          { once: true },
        ),
      );
    });
    const { result, rerender } = renderHook(
      ({ user }) => useChatbot({ pathname: "/", user }),
      {
        initialProps: { user: { id: "demo-a" } },
      },
    );

    act(() => {
      result.current.sendMessage("Pendiente");
    });
    await waitFor(() => expect(askAssistant).toHaveBeenCalledOnce());
    rerender({ user: { id: "demo-b" } });

    await waitFor(() => expect(signal.aborted).toBe(true));
    await waitFor(() =>
      expect(
        result.current.messages.some(
          ({ content }) => content === "Respuesta tardía",
        ),
      ).toBe(false),
    );
  });

  test("aborts a pending request when the chat is cleared", async () => {
    let signal;
    askAssistant.mockImplementation((_payload, options) => {
      signal = options.signal;
      return new Promise((resolve) =>
        signal.addEventListener(
          "abort",
          () =>
            resolve({
              success: true,
              answer: "Respuesta tardía",
              requestId: "late",
            }),
          { once: true },
        ),
      );
    });
    const { result } = renderHook(() =>
      useChatbot({ pathname: "/", user: { id: "demo-a" } }),
    );

    act(() => {
      result.current.sendMessage("Pendiente");
    });
    await waitFor(() => expect(askAssistant).toHaveBeenCalledOnce());
    act(() => {
      result.current.clearChat();
    });

    await waitFor(() => expect(signal.aborted).toBe(true));
    expect(
      result.current.messages.some(
        ({ content }) =>
          content === "Pendiente" || content === "Respuesta tardía",
      ),
    ).toBe(false);
  });
});

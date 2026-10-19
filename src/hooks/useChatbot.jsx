import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { askAssistant } from "../services/aiService.js";

const maxMessages = 50;
function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function getWelcome(t) {
  return {
    id: "welcome",
    role: "assistant",
    content: t("chat.welcome"),
    createdAt: new Date().toISOString(),
    status: "sent",
  };
}
function getHistoryKey(identity) {
  return `rc_chat_history:${identity}`;
}

function loadMessages(identity, t) {
  const welcome = getWelcome(t);
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(getHistoryKey(identity)) || "null",
    );
    if (!Array.isArray(saved)) return [welcome];
    const history = saved
      .filter(
        (item) =>
          item &&
          ["assistant", "user"].includes(item.role) &&
          typeof item.content === "string" &&
          typeof item.id === "string",
      )
      .slice(-maxMessages);
    return [welcome, ...history.filter((item) => item.id !== "welcome")];
  } catch {
    return [welcome];
  }
}

function pageContext(pathname) {
  if (pathname.startsWith("/mapa")) return "map";
  if (pathname.startsWith("/galeria")) return "gallery";
  if (pathname.startsWith("/proyecto")) return "restoration";
  if (pathname.startsWith("/noticias")) return "information";
  if (pathname.startsWith("/login")) return "access";
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/observaciones")) return "field-tracking";
  return "home";
}

export function useChatbot({ pathname, user, open = true } = {}) {
  const { t, i18n } = useTranslation();
  const identity = user?.id || "guest";
  const [messageState, setMessageState] = useState(() => ({
    identity,
    messages: loadMessages(identity, t),
  }));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestControllerRef = useRef(null);
  const requestVersionRef = useRef(0);
  const identityRef = useRef(identity);
  identityRef.current = identity;
  const messages =
    messageState.identity === identity
      ? messageState.messages
      : [getWelcome(t)];

  useEffect(() => {
    requestVersionRef.current += 1;
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setMessageState({ identity, messages: loadMessages(identity, t) });
    setInput("");
    setIsLoading(false);
    setError("");
  }, [identity, t]);

  useEffect(() => {
    if (!open) {
      requestVersionRef.current += 1;
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
      setIsLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (messageState.identity !== identity) return;
    try {
      sessionStorage.setItem(
        getHistoryKey(identity),
        JSON.stringify(messageState.messages.slice(-maxMessages)),
      );
    } catch {
      setError("CHAT_STORAGE_UNAVAILABLE");
    }
  }, [identity, messageState]);

  useEffect(() => {
    setMessageState((current) =>
      current.identity === identity
        ? {
            ...current,
            messages: current.messages.map((message, index) =>
              index === 0 && message.id === "welcome"
                ? { ...message, content: t("chat.welcome") }
                : message,
            ),
          }
        : current,
    );
  }, [identity, i18n.language, t]);

  const context = useMemo(
    () => ({ page: pageContext(pathname || "/") }),
    [pathname],
  );
  const request = useCallback(
    async (text, addUser = true) => {
      const message = typeof text === "string" ? text.trim() : "";
      if (!message || isLoading || message.length > 2000) {
        if (message.length > 2000) setError("INVALID_INPUT");
        return false;
      }

      setError("");
      if (addUser) {
        setMessageState((current) =>
          current.identity === identity
            ? {
                ...current,
                messages: [
                  ...current.messages,
                  {
                    id: makeId("user"),
                    role: "user",
                    content: message,
                    createdAt: new Date().toISOString(),
                    status: "sent",
                  },
                ],
              }
            : current,
        );
      }
      setInput("");
      setIsLoading(true);
      const version = ++requestVersionRef.current;
      const controller = new AbortController();
      requestControllerRef.current = controller;
      const response = await askAssistant(
        {
          message,
          language: i18n.language.split("-")[0],
          context,
        },
        { signal: controller.signal },
      );
      if (
        version !== requestVersionRef.current ||
        identityRef.current !== identity
      )
        return false;

      if (response.success) {
        setMessageState((current) =>
          current.identity === identity
            ? {
                ...current,
                messages: [
                  ...current.messages,
                  {
                    id: response.requestId || makeId("assistant"),
                    role: "assistant",
                    content: response.answer,
                    createdAt: new Date().toISOString(),
                    status: "sent",
                  },
                ],
              }
            : current,
        );
      } else {
        setError(response.error || "UNKNOWN_ERROR");
      }
      requestControllerRef.current = null;
      setIsLoading(false);
      return response.success;
    },
    [context, i18n.language, identity, isLoading],
  );

  const sendMessage = useCallback(
    (text = input) => request(text),
    [input, request],
  );
  const retryMessage = useCallback(() => {
    const previous = [...messages]
      .reverse()
      .find((item) => item.role === "user");
    return previous ? request(previous.content, false) : false;
  }, [messages, request]);
  const clearChat = useCallback(() => {
    requestVersionRef.current += 1;
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    const welcome = getWelcome(t);
    try {
      sessionStorage.removeItem(getHistoryKey(identity));
    } catch {
      setError("CHAT_STORAGE_UNAVAILABLE");
    }
    setMessageState({ identity, messages: [welcome] });
    setIsLoading(false);
  }, [identity, t]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    retryMessage,
    clearChat,
    context,
  };
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { askAssistant } from '../services/aiService.js';

const storageKey = 'rc_chat_history'; const maxMessages = 50;
function makeId(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function getWelcome(t) { return { id: 'welcome', role: 'assistant', content: t('chat.welcome'), createdAt: new Date().toISOString(), status: 'sent' }; }
function loadMessages(t) { try { const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null'); return Array.isArray(saved) && saved.length ? saved : [getWelcome(t)]; } catch { return [getWelcome(t)]; } }
function pageContext(pathname) { if (pathname.startsWith('/mapa')) return 'map'; if (pathname.startsWith('/galeria')) return 'gallery'; if (pathname.startsWith('/proyecto')) return 'restoration'; if (pathname.startsWith('/noticias')) return 'information'; if (pathname.startsWith('/login')) return 'access'; if (pathname.startsWith('/dashboard')) return 'dashboard'; if (pathname.startsWith('/observaciones')) return 'field-tracking'; return 'home'; }
function sessionRole(role) { const value = String(role || '').toUpperCase(); return ['ADMIN', 'MODERATOR', 'USER'].includes(value) ? value : 'USER'; }

export function useChatbot({ pathname, user } = {}) {
  const { t, i18n } = useTranslation(); const [messages, setMessages] = useState(() => loadMessages(t)); const [input, setInput] = useState(''); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState('');
  useEffect(() => { if (messages.length) sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-maxMessages))); }, [messages]);
  useEffect(() => { setMessages((current) => current[0]?.id === 'welcome' ? [{ ...current[0], content: t('chat.welcome') }, ...current.slice(1)] : current); }, [i18n.language, t]);
  const context = useMemo(() => ({ page: pageContext(pathname || '/') }), [pathname]);
  const request = useCallback(async (text, addUser = true) => {
    const message = text.trim(); if (!message || isLoading) return false;
    setError(''); if (addUser) setMessages((current) => [...current, { id: makeId('user'), role: 'user', content: message, createdAt: new Date().toISOString(), status: 'sent' }]); setInput(''); setIsLoading(true);
    const response = await askAssistant({ message, language: i18n.language.split('-')[0], role: sessionRole(user?.role), context });
    if (response.success) setMessages((current) => [...current, { id: response.requestId || makeId('assistant'), role: 'assistant', content: response.answer, createdAt: new Date().toISOString(), status: 'sent' }]); else setError(response.error || 'UNKNOWN_ERROR'); setIsLoading(false); return response.success;
  }, [context, i18n.language, isLoading, user?.role]);
  const sendMessage = useCallback((text = input) => request(text), [input, request]);
  const retryMessage = useCallback(() => { const previous = [...messages].reverse().find((item) => item.role === 'user'); return previous ? request(previous.content, false) : false; }, [messages, request]);
  const clearChat = useCallback(() => { const welcome = getWelcome(t); sessionStorage.removeItem(storageKey); setMessages([welcome]); setError(''); }, [t]);
  return { messages, input, setInput, isLoading, error, sendMessage, retryMessage, clearChat, context };
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { speechDefaults, speechLanguageMap } from '../accessibility/speech/speechConfig.js';
import * as speech from '../accessibility/speech/speechService.js';

const enabledKey = 'narratorEnabled'; const rateKey = 'narratorRate'; const volumeKey = 'narratorVolume'; const NarratorContext = createContext(null);
const readableSelector = 'h1,h2,h3,h4,h5,h6,p,span,button,a,label,li,figcaption,img,input,select,textarea';

function readStoredNumber(key, fallback, min, max) { const value = Number(localStorage.getItem(key)); return Number.isFinite(value) && value >= min && value <= max ? value : fallback; }
function readableText(element) {
  if (!element || element.closest('[data-narrator-ignore], [aria-hidden="true"], [hidden]')) return '';
  if (element.matches('input,select,textarea')) { const escapedId = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(element.id) : element.id; const label = element.id ? document.querySelector(`label[for="${escapedId}"]`) : element.closest('label'); return `${label?.textContent || element.getAttribute('aria-label') || element.getAttribute('placeholder') || ''}`.replace(/\s+/g, ' ').trim(); }
  const labelledBy = element.getAttribute('aria-labelledby'); if (labelledBy) return labelledBy.split(/\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').replace(/\s+/g, ' ').trim();
  const ariaLabel = element.getAttribute('aria-label'); if (ariaLabel) return ariaLabel.trim(); const alt = element.getAttribute('alt'); if (alt) return alt.trim();
  return (element.textContent || '').replace(/\s+/g, ' ').trim();
}
function targetElement(node) { const element = typeof Element !== 'undefined' && node instanceof Element ? node.closest(readableSelector) : null; return element && readableText(element) ? element : null; }

export function NarratorProvider({ children }) {
  const { i18n } = useTranslation(); const [enabled, setEnabled] = useState(() => localStorage.getItem(enabledKey) === 'true'); const [rate, setRateState] = useState(() => readStoredNumber(rateKey, speechDefaults.rate, .5, 2)); const [volume, setVolumeState] = useState(() => readStoredNumber(volumeKey, speechDefaults.volume, 0, 1)); const [speaking, setSpeaking] = useState(false); const timer = useRef(null); const lastRead = useRef({ text: '', at: 0 });
  const supported = speech.isSupported(); const language = i18n.language?.split('-')[0] || 'es';
  const stop = useCallback(() => { if (timer.current && typeof window !== 'undefined') window.clearTimeout(timer.current); speech.stop(); setSpeaking(false); }, []);
  const say = useCallback((text) => { if (!enabled || !text || !supported) return; const now = Date.now(); if (lastRead.current.text === text && now - lastRead.current.at < 900) return; lastRead.current = { text, at: now }; setSpeaking(speech.speak(text, { language, rate, volume })); }, [enabled, language, rate, supported, volume]);
  useEffect(() => { if (enabled) localStorage.setItem(enabledKey, 'true'); else { localStorage.setItem(enabledKey, 'false'); stop(); } }, [enabled, stop]);
  useEffect(() => { localStorage.setItem(rateKey, String(rate)); }, [rate]); useEffect(() => { localStorage.setItem(volumeKey, String(volume)); }, [volume]);
  useEffect(() => { stop(); }, [i18n.language, stop]);
  useEffect(() => { if (!enabled || !supported) return undefined; const onPointerOver = (event) => { const element = targetElement(event.target); if (!element || element.matches(':hover') === false) return; if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return; if (timer.current) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => say(readableText(element)), speechDefaults.hoverDelay); }; const onPointerOut = (event) => { const element = targetElement(event.target); if (element && event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return; if (timer.current) window.clearTimeout(timer.current); }; const onFocusIn = (event) => { const element = targetElement(event.target); if (element) say(readableText(element)); }; document.addEventListener('pointerover', onPointerOver, true); document.addEventListener('pointerout', onPointerOut, true); document.addEventListener('focusin', onFocusIn, true); return () => { document.removeEventListener('pointerover', onPointerOver, true); document.removeEventListener('pointerout', onPointerOut, true); document.removeEventListener('focusin', onFocusIn, true); if (timer.current) window.clearTimeout(timer.current); }; }, [enabled, say, supported]);
  const value = useMemo(() => ({ enabled, setEnabled, rate, setRate: setRateState, volume, setVolume: setVolumeState, speaking, supported, language, voiceLocale: speechLanguageMap[language] || speechLanguageMap.es, say, stop, pause: speech.pause, resume: speech.resume }), [enabled, language, rate, say, speaking, stop, supported, volume]);
  return <NarratorContext.Provider value={value}>{children}</NarratorContext.Provider>;
}
export function useNarrator() { return useContext(NarratorContext); }

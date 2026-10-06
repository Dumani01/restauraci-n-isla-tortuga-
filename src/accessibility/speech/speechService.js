import { speechDefaults, speechLanguageMap } from './speechConfig.js';

function getSynthesis() { return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null; }

export function isSupported() { return Boolean(getSynthesis() && typeof window.SpeechSynthesisUtterance === 'function'); }
export function getVoices() { return getSynthesis()?.getVoices?.() ?? []; }
export function chooseVoice(language) {
  const voices = getVoices(); const locale = speechLanguageMap[language] || speechLanguageMap.es; const base = locale.split('-')[0];
  return voices.find((voice) => voice.lang?.toLowerCase() === locale.toLowerCase()) || voices.find((voice) => voice.lang?.toLowerCase().startsWith(`${base}-`)) || voices.find((voice) => voice.lang?.toLowerCase().startsWith('es-')) || voices[0];
}
export function speak(text, options = {}) {
  const synthesis = getSynthesis(); if (!synthesis || typeof window.SpeechSynthesisUtterance !== 'function' || !text?.trim()) return false;
  synthesis.cancel(); const utterance = new window.SpeechSynthesisUtterance(text.trim()); const voice = chooseVoice(options.language || 'es');
  Object.assign(utterance, { lang: speechLanguageMap[options.language] || speechLanguageMap.es, rate: options.rate ?? speechDefaults.rate, volume: options.volume ?? speechDefaults.volume, pitch: options.pitch ?? speechDefaults.pitch }); if (voice) utterance.voice = voice; synthesis.speak(utterance); return true;
}
export function stop() { getSynthesis()?.cancel?.(); }
export function pause() { getSynthesis()?.pause?.(); }
export function resume() { getSynthesis()?.resume?.(); }

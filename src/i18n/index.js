import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es/translation.json';
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';

export const supportedLanguages = ['es', 'en', 'fr', 'de', 'pt'];
export const voiceLocales = { es: 'es-CR', en: 'en-US', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR' };
const storageKey = 'preferredLanguage';

function getInitialLanguage() {
  const saved = localStorage.getItem(storageKey);
  if (supportedLanguages.includes(saved)) return saved;
  if (import.meta.env.MODE === 'test') return 'es';
  const browser = (navigator.language || 'es').split('-')[0].toLowerCase();
  return supportedLanguages.includes(browser) ? browser : 'es';
}

export function updateDocumentLanguage(language) {
  document.documentElement.lang = language;
}

i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en }, fr: { translation: fr }, de: { translation: de }, pt: { translation: pt } },
  lng: getInitialLanguage(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
});

updateDocumentLanguage(i18n.language);
i18n.on('languageChanged', (language) => {
  localStorage.setItem(storageKey, language);
  updateDocumentLanguage(language);
});

export function changeLanguage(language) {
  if (supportedLanguages.includes(language)) return i18n.changeLanguage(language);
  return Promise.resolve(i18n.language);
}

export { storageKey };
export default i18n;

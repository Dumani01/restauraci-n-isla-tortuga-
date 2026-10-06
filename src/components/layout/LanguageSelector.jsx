import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, supportedLanguages } from '../../i18n/index.js';

const languageNames = { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch', pt: 'Português' };

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  return <label className="language-selector" aria-label={t('languageSelector.label')}><Globe size={15} aria-hidden="true" /><span className="sr-only">{t('languageSelector.choose')}</span><select value={i18n.language} onChange={(event) => changeLanguage(event.target.value)} aria-label={t('languageSelector.current')}>{supportedLanguages.map((language) => <option key={language} value={language}>{languageNames[language]}</option>)}</select></label>;
}

import { afterEach, describe, expect, test } from 'vitest';
import es from './locales/es/translation.json';
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import pt from './locales/pt/translation.json';
import { changeLanguage, supportedLanguages } from './index.js';

const translations = { es, en, fr, de, pt };

function getTranslationKeys(value, prefix = '') {
  return Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return entry && typeof entry === 'object' && !Array.isArray(entry)
      ? getTranslationKeys(entry, path)
      : [path];
  });
}

function getTranslation(value, path) {
  return path.split('.').reduce((entry, key) => entry?.[key], value);
}

describe('i18n locale integrity', () => {
  afterEach(async () => {
    await changeLanguage('es');
  });

  test('all locales contain the same nested translation keys', () => {
    const expectedKeys = getTranslationKeys(es).sort();

    for (const [language, translation] of Object.entries(translations)) {
      expect(getTranslationKeys(translation).sort(), language).toEqual(expectedKeys);
    }
  });

  test('keeps the document language synchronized with language changes', async () => {
    for (const language of supportedLanguages) {
      await changeLanguage(language);
      expect(document.documentElement.lang).toBe(language);
    }
  });

  test('localizes project and map data that originate in db.json', () => {
    const paths = [
      'content.locationDescription',
      'content.howWeWork',
      'content.whyRestore',
      'content.collaboration',
      'map.records.demo-restoration-zone.name',
      'map.records.demo-restoration-zone.description',
      'map.records.demo-monitoring.name',
      'map.records.demo-activity.name',
      'map.records.demo-tourism.name',
    ];

    for (const language of ['en', 'fr', 'de', 'pt']) {
      for (const path of paths) {
        expect(getTranslation(translations[language], path), `${language}:${path}`)
          .not.toEqual(getTranslation(es, path));
      }
    }
  });
});

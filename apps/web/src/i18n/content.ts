import type { Locale } from '@/context/locale-context';
import enDictionary from '@/data/seed-translations.en.json';

/**
 * Offline fallback for localized preset content. Mirrors the API's seed
 * translations (apps/api/resources/seed/translations.en.json): Czech phrase => translation.
 */
const DICTIONARIES: Partial<Record<Locale, Record<string, string>>> = {
  en: enDictionary,
};

/** Query value for the API's `?locale=` parameter; Czech is the base content. */
export function apiLocale(locale?: Locale): string | null {
  return locale && locale !== 'cs' ? locale : null;
}

function translateValue(value: unknown, dictionary: Record<string, string>): unknown {
  if (typeof value === 'string') return dictionary[value] ?? value;
  if (Array.isArray(value)) return value.map(v => translateValue(v, dictionary));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translateValue(v, dictionary)]));
  }
  return value;
}

export function localizePreset<T extends object>(item: T, fields: (keyof T)[], locale?: Locale): T {
  const dictionary = locale ? DICTIONARIES[locale] : undefined;
  if (!dictionary) return item;

  const localized = { ...item };
  for (const field of fields) {
    localized[field] = translateValue(item[field], dictionary) as T[keyof T];
  }
  return localized;
}

/**
 * Language identification utility.
 * Supports language names spelled in 5 languages: English, German, French, Spanish, Italian,
 * as well as standard 2-letter language codes.
 */

// Normalized dictionary mapping all supported spellings to 2-letter ISO codes.
const LANGUAGE_LOOKUP: Record<string, string> = {
  // English (en)
  'en': 'en',
  'english': 'en',
  'englisch': 'en',
  'anglais': 'en',
  'ingles': 'en',
  'inglese': 'en',

  // German (de)
  'de': 'de',
  'german': 'de',
  'deutsch': 'de',
  'allemand': 'de',
  'aleman': 'de',
  'tedesco': 'de',

  // French (fr)
  'fr': 'fr',
  'french': 'fr',
  'franzosisch': 'fr',
  'franzoesisch': 'fr',
  'francais': 'fr',
  'frances': 'fr',
  'francese': 'fr',

  // Spanish (es)
  'es': 'es',
  'spanish': 'es',
  'spanisch': 'es',
  'espagnol': 'es',
  'espanol': 'es',
  'spagnolo': 'es',

  // Italian (it)
  'it': 'it',
  'italian': 'it',
  'italienisch': 'it',
  'italien': 'it',
  'italiano': 'it',

  // Dutch (nl)
  'nl': 'nl',
  'dutch': 'nl',
  'niederlandisch': 'nl',
  'niederlaendisch': 'nl',
  'hollandisch': 'nl',
  'hollaendisch': 'nl',
  'neerlandais': 'nl',
  'hollandais': 'nl',
  'holandes': 'nl',
  'neerlandes': 'nl',
  'olandese': 'nl',
}

/**
 * Normalizes a language name string by:
 * - Trimming whitespace
 * - Converting to lower case
 * - Stripping diacritics / accent marks (e.g. 'Español' -> 'espanol', 'Französisch' -> 'franzosisch')
 */
export function normalizeLanguageName(raw: string): string {
  if (!raw) return ''
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Also handle German umlaut transcription 'oe', 'ae', 'ue' if needed, though lookup already handles both
}

/**
 * Identifies the 2-letter language code from a given string spelled in
 * English, German, French, Spanish, or Italian.
 * Returns the 2-letter language code if recognized (e.g. 'en', 'de', 'fr', 'es', 'it', 'nl'),
 * or null if the string cannot be identified as one of the supported languages.
 */
export function identifyLanguage(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null
  const normalized = normalizeLanguageName(raw)
  if (!normalized) return null
  return LANGUAGE_LOOKUP[normalized] || null
}

/**
 * Returns true if the language is recognized.
 */
export function isIdentifiableLanguage(raw: string): boolean {
  return identifyLanguage(raw) !== null
}

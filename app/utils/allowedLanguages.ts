export interface UserLanguagePreferences {
  sourceLanguage?: string | null
  showSourceLanguageMaterials?: boolean | null
  targetLanguages?: string[] | null
}

/**
 * Returns the lowercase language codes a logged-in user is allowed to see
 * in learning materials (their targetLanguages, plus sourceLanguage only if
 * showSourceLanguageMaterials is enabled).
 */
export function getAllowedLanguages(prefs: UserLanguagePreferences | null | undefined): Set<string> {
  const allowed = new Set<string>()
  if (Array.isArray(prefs?.targetLanguages)) {
    for (const lang of prefs.targetLanguages) {
      if (lang) allowed.add(lang.toLowerCase())
    }
  }
  if (prefs?.showSourceLanguageMaterials && prefs?.sourceLanguage) {
    allowed.add(prefs.sourceLanguage.toLowerCase())
  }
  return allowed
}

const LANGUAGE_BASICS_CODES = ['fr', 'es', 'it', 'nl']

/**
 * Determines whether a given activity route should appear in menus/lists
 * for a user with the provided allowed languages (null = logged-out user, sees all).
 */
export function isActivityVisible(path: string, allowedLanguages: Set<string> | null): boolean {
  if (!allowedLanguages) return true
  if (path === '/activities/spanish-verbs') return allowedLanguages.has('es')
  if (path === '/activities/learn-a-de') return allowedLanguages.has('fr')
  if (path === '/activities/language-basics') {
    return LANGUAGE_BASICS_CODES.some(code => allowedLanguages.has(code))
  }
  return true
}


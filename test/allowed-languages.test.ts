import { describe, it, expect } from 'vitest'
import { getAllowedLanguages, isActivityVisible } from '../app/utils/allowedLanguages'

describe('getAllowedLanguages', () => {
  it('returns only targetLanguages when showSourceLanguageMaterials is false', () => {
    const allowed = getAllowedLanguages({
      sourceLanguage: 'es',
      showSourceLanguageMaterials: false,
      targetLanguages: ['fr', 'de']
    })
    expect(Array.from(allowed)).toEqual(['fr', 'de'])
    expect(allowed.has('es')).toBe(false)
  })

  it('includes sourceLanguage when showSourceLanguageMaterials is true', () => {
    const allowed = getAllowedLanguages({
      sourceLanguage: 'ES',
      showSourceLanguageMaterials: true,
      targetLanguages: ['fr']
    })
    expect(allowed.has('fr')).toBe(true)
    expect(allowed.has('es')).toBe(true)
  })

  it('defaults showSourceLanguageMaterials to false when omitted', () => {
    const allowed = getAllowedLanguages({
      sourceLanguage: 'en',
      targetLanguages: ['NL']
    })
    expect(Array.from(allowed)).toEqual(['nl'])
  })
})

describe('isActivityVisible', () => {
  it('shows all activities when allowedLanguages is null (logged out)', () => {
    expect(isActivityVisible('/activities/spanish-verbs', null)).toBe(true)
    expect(isActivityVisible('/activities/learn-a-de', null)).toBe(true)
    expect(isActivityVisible('/activities/language-basics', null)).toBe(true)
    expect(isActivityVisible('/activities/gemini-quiz', null)).toBe(true)
  })

  it('shows Spanish Verbs only when es is allowed', () => {
    expect(isActivityVisible('/activities/spanish-verbs', new Set(['fr', 'de']))).toBe(false)
    expect(isActivityVisible('/activities/spanish-verbs', new Set(['fr', 'es']))).toBe(true)
  })

  it('shows Learn à/de only when fr is allowed', () => {
    expect(isActivityVisible('/activities/learn-a-de', new Set(['es', 'de']))).toBe(false)
    expect(isActivityVisible('/activities/learn-a-de', new Set(['fr']))).toBe(true)
  })

  it('shows Language Basics only when at least one of fr, es, it, nl is allowed', () => {
    expect(isActivityVisible('/activities/language-basics', new Set(['de', 'pl']))).toBe(false)
    expect(isActivityVisible('/activities/language-basics', new Set(['nl']))).toBe(true)
  })

  it('always shows language-agnostic activities', () => {
    const empty = new Set<string>()
    expect(isActivityVisible('/activities/gemini-quiz', empty)).toBe(true)
    expect(isActivityVisible('/activities/correction-journal', empty)).toBe(true)
    expect(isActivityVisible('/activities/pronunciation-practice', empty)).toBe(true)
    expect(isActivityVisible('/activities/starred-texts', empty)).toBe(true)
  })
})


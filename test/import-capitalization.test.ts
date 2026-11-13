import { describe, it, expect } from 'vitest'
import { normalizeFirstLetterCapitalization, analyzeImportRows } from '../server/utils/import-service'

describe('normalizeFirstLetterCapitalization', () => {
  it('lowercases the first letter of normal words and phrases', () => {
    expect(normalizeFirstLetterCapitalization('Hello world')).toBe('hello world')
    expect(normalizeFirstLetterCapitalization('Bonjour')).toBe('bonjour')
    expect(normalizeFirstLetterCapitalization('Guten Tag')).toBe('guten Tag')
  })

  it('preserves capitalization for exception list words like I, Sie, Berlin, Paris', () => {
    expect(normalizeFirstLetterCapitalization('I am here')).toBe('I am here')
    expect(normalizeFirstLetterCapitalization("I'm fine")).toBe("I'm fine")
    expect(normalizeFirstLetterCapitalization('Sie haben recht')).toBe('Sie haben recht')
    expect(normalizeFirstLetterCapitalization('Berlin is great')).toBe('Berlin is great')
    expect(normalizeFirstLetterCapitalization('Paris')).toBe('Paris')
    expect(normalizeFirstLetterCapitalization('Germany')).toBe('Germany')
  })

  it('applies default lowercasing in analyzeImportRows and respects lowercaseFirst=false', () => {
    const rows = [
      { lang1: 'English', lang2: 'French', text1: 'Good morning', text2: 'Bonjour' },
      { lang1: 'English', lang2: 'German', text1: 'I live in Berlin', text2: 'Berlin ist schön' }
    ]
    const lowered = analyzeImportRows(new Set(), rows, 'en')
    expect(lowered.willImport[0]!.front).toBe('good morning')
    expect(lowered.willImport[0]!.back).toBe('*bonjour*')
    expect(lowered.willImport[1]!.front).toBe('I live in Berlin')
    expect(lowered.willImport[1]!.back).toBe('Berlin ist schön')

    const preserved = analyzeImportRows(new Set(), rows, 'en', { lowercaseFirst: false })
    expect(preserved.willImport[0]!.front).toBe('Good morning')
    expect(preserved.willImport[0]!.back).toBe('*Bonjour*')
  })
})


import { describe, it, expect } from 'vitest'
import { cleanTrailingPunctuation } from '../server/utils/import-service'

describe('cleanTrailingPunctuation', () => {
  it('strips periods, commas, colons, semicolons, and exclamation points', () => {
    expect(cleanTrailingPunctuation('Hello.')).toBe('Hello')
    expect(cleanTrailingPunctuation('Hello!')).toBe('Hello')
    expect(cleanTrailingPunctuation('Hello,')).toBe('Hello')
    expect(cleanTrailingPunctuation('Hello;')).toBe('Hello')
    expect(cleanTrailingPunctuation('Hello: ')).toBe('Hello')
  })

  it('reduces ellipses ... to nothing', () => {
    expect(cleanTrailingPunctuation('Bonjour...')).toBe('Bonjour')
    expect(cleanTrailingPunctuation('Bonjour…')).toBe('Bonjour')
  })

  it('keeps single question mark and reduces multiple question marks to single ?', () => {
    expect(cleanTrailingPunctuation('Comment ça va?')).toBe('Comment ça va?')
    expect(cleanTrailingPunctuation('Comment ça va???')).toBe('Comment ça va?')
    expect(cleanTrailingPunctuation('Comment ça va!?')).toBe('Comment ça va?')
    expect(cleanTrailingPunctuation('Comment ça va...???')).toBe('Comment ça va?')
  })

  it('preserves single or wrapped asterisks properly', () => {
    expect(cleanTrailingPunctuation('*bonjour.*')).toBe('*bonjour*')
    expect(cleanTrailingPunctuation('*bonjour???*')).toBe('*bonjour?*')
  })
})

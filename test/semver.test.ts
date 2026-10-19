import { describe, it, expect } from 'vitest'
import { compareSemVerDesc, compareSemVerAsc } from '../shared/utils/semver'

describe('SemVer sorting utility', () => {
  it('correctly orders 0.10.0 ahead of 0.9.1 in descending order', () => {
    const versions = ['0.9.1', '0.10.0', '0.2.0', '0.9.0', '0.0.0']
    const sorted = [...versions].sort(compareSemVerDesc)
    expect(sorted).toEqual(['0.10.0', '0.9.1', '0.9.0', '0.2.0', '0.0.0'])
  })

  it('handles leading "v" prefix gracefully', () => {
    const versions = ['v0.9.1', '0.10.0', 'v0.10.1', 'v0.2.0']
    const sorted = [...versions].sort(compareSemVerDesc)
    expect(sorted).toEqual(['v0.10.1', '0.10.0', 'v0.9.1', 'v0.2.0'])
  })

  it('handles missing components and edge cases', () => {
    expect(compareSemVerDesc('0.10', '0.10.0')).toBe(0)
    expect(compareSemVerDesc('0.10.1', '0.10')).toBeLessThan(0) // 0.10.1 is greater than 0.10, so desc comparison returns negative
    expect(compareSemVerDesc(null, '0.1.0')).toBeGreaterThan(0)
    expect(compareSemVerDesc('0.1.0', null)).toBeLessThan(0)
    expect(compareSemVerDesc(null, null)).toBe(0)
  })

  it('sorts ascending properly with compareSemVerAsc', () => {
    const versions = ['0.10.0', '0.9.1', '0.1.0']
    const sorted = [...versions].sort(compareSemVerAsc)
    expect(sorted).toEqual(['0.1.0', '0.9.1', '0.10.0'])
  })
})

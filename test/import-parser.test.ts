import { describe, it, expect } from 'vitest'
import { parseImportText } from '../server/utils/import-parser'
import { analyzeImportRows } from '../server/utils/import-service'

describe('parseImportText', () => {
  it('correctly parses user snippet with mixed 1, 2, and 3 line cards', () => {
    const text = `A    B    C    D
1
English\tGerman\t
the token, the tokens
der Token, die Token
2
English\tFrench\t
I will arrive by train
J'arriverai en train.
3
English\tFrench\tI was in a plane\t
J'étais dans un avion.
4
English\tFrench\tabsolutely\tabsolument
5
English\tFrench\tmany times\tplusieurs fois
6
English\tFrench\t
I have to walk through a narrow space
Je dois passer par un passage étroit.`

    const rows = parseImportText(text)
    expect(rows).toHaveLength(6)

    // Card 1 (3 lines: lang on 1, text1 on 2, text2 on 3)
    expect(rows[0]?.text1).toBe('the token, the tokens')
    expect(rows[0]?.text2).toBe('der Token, die Token')

    // Card 2 (3 lines)
    expect(rows[1]?.text1).toBe('I will arrive by train')
    expect(rows[1]?.text2).toBe("J'arriverai en train.")

    // Card 3 (2 lines: lang + text1 on 1, text2 on 2)
    expect(rows[2]?.text1).toBe('I was in a plane')
    expect(rows[2]?.text2).toBe("J'étais dans un avion.")

    // Card 4 (1 line: lang + text1 + text2 on 1)
    expect(rows[3]?.text1).toBe('absolutely')
    expect(rows[3]?.text2).toBe('*absolument*') // single target word wrapped with asterisks

    // Card 5 (1 line: lang + text1 + text2 on 1)
    expect(rows[4]?.text1).toBe('many times')
    expect(rows[4]?.text2).toBe('plusieurs fois')

    // Card 6 (3 lines)
    expect(rows[5]?.text1).toBe('I have to walk through a narrow space')
    expect(rows[5]?.text2).toBe('Je dois passer par un passage étroit.')
  })

  it('marks incomplete cards with empty text2 and reports in analyzeImportRows', () => {
    const text = `1
English\tFrench\tI was in a plane
2
English\tFrench\tabsolutely\tabsolument`

    const rows = parseImportText(text)
    expect(rows).toHaveLength(2)
    expect(rows[0]?.text1).toBe('I was in a plane')
    expect(rows[0]?.text2).toBe('')

    expect(rows[1]?.text1).toBe('absolutely')
    expect(rows[1]?.text2).toBe('*absolument*')

    const analysis = analyzeImportRows(new Set(), rows)
    expect(analysis.willNotImport).toHaveLength(1)
    expect(analysis.willNotImport[0]?.reason).toBe('Incomplete card (missing back text)')
    expect(analysis.willImport).toHaveLength(1)
    expect(analysis.willImport[0]?.front).toBe('absolutely')
  })

  it('handles 2-column language header followed by tab-separated front and back', () => {
    const text = `1
English\tFrench
apple\tla pomme
2
English\tFrench\tabsolutely\tabsolument`

    const rows = parseImportText(text)
    expect(rows).toHaveLength(2)
    expect(rows[0]?.text1).toBe('apple')
    expect(rows[0]?.text2).toBe('la pomme')
    expect(rows[1]?.text1).toBe('absolutely')
  })
})

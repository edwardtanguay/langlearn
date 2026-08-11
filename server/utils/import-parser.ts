import { parseMetadata } from './metadata-parser'
import { calculateOptimalRank } from './rank-config'

export interface ParsedRow {
  lang1: string
  lang2: string
  text1: string
  text2: string
  rank?: number
  pronunciation?: string
  memoryHook?: string
}

function parseCSVOrTSVLine(line: string): string[] {
  // If line contains tabs, split by tab
  if (line.includes('\t')) {
    return line.split('\t').map(s => s.trim().replace(/^"|"$/g, ''))
  }
  // Otherwise parse standard CSV
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result.map(val => val.replace(/^"|"$/g, '').trim())
}

const KNOWN_LANGS = new Set(['french', 'english', 'german', 'spanish', 'italian', 'dutch', 'polish', 'russian', 'icelandic', 'danish', 'greek', 'fr', 'en', 'de', 'es', 'it', 'nl', 'pl', 'ru', 'is', 'da', 'el'])

function isLanguage(str: string): boolean {
  return KNOWN_LANGS.has(str.trim().toLowerCase())
}

export function parseImportText(text: string): ParsedRow[] {
  if (!text || !text.trim()) return []

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0)
  const rows: ParsedRow[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]!

    // Skip column header line if it starts with A B C D or lang1,lang2...
    if (/^[A-D](\t[A-D])+$|^lang1/i.test(line)) {
      i++
      continue
    }

    // Check if line is a standalone item number (e.g. "1", "2", "3.")
    if (/^\d+\.?$/.test(line)) {
      i++
      if (i >= lines.length) break

      const headerLine = lines[i]!
      const headerCols = parseCSVOrTSVLine(headerLine)

      if (headerCols.length >= 2 && isLanguage(headerCols[0]!) && isLanguage(headerCols[1]!)) {
        const lang1 = headerCols[0]!
        const lang2 = headerCols[1]!

        if (headerCols.length >= 3 && headerCols[2]!.length > 0) {
          // Header has text1 (e.g. English\tFrench\tthe lid of the jar)
          const text1 = headerCols[2]!
          i++
          if (i < lines.length) {
            const text2 = lines[i]!
            rows.push(buildParsedRow(lang1, lang2, text1, text2))
          }
        } else {
          // Header has only languages (e.g. French\tEnglish)
          i++
          if (i < lines.length) {
            const text1 = lines[i]!
            i++
            if (i < lines.length) {
              const text2 = lines[i]!
              rows.push(buildParsedRow(lang1, lang2, text1, text2))
            }
          }
        }
        i++
        continue
      }
    }

    // Single-line CSV/TSV format check
    const cols = parseCSVOrTSVLine(line)
    if (cols.length >= 4 && isLanguage(cols[0]!) && isLanguage(cols[1]!)) {
      rows.push(buildParsedRow(cols[0]!, cols[1]!, cols[2]!, cols[3]!))
      i++
      continue
    }

    // Fallback: If line doesn't match known structures, advance
    i++
  }

  return rows
}

function stripMonAmiPrefix(input: string): string {
  if (!input) return ''
  return input.replace(/^Mon ami,?\s*/i, '').trim()
}

function buildParsedRow(lang1: string, lang2: string, text1: string, text2: string): ParsedRow {
  const cleanText1 = stripMonAmiPrefix(text1)
  const cleanText2 = stripMonAmiPrefix(text2)

  const meta1 = parseMetadata(cleanText1)
  const meta2 = parseMetadata(cleanText2)

  let frontClean = ''
  if (lang1.toLowerCase() === 'english') {
    frontClean = meta1.cleanText
  } else if (lang2.toLowerCase() === 'english') {
    frontClean = meta2.cleanText
  } else {
    frontClean = meta1.cleanText
  }

  const rank = meta1.rank ?? meta2.rank ?? calculateOptimalRank(frontClean)
  const pronunciation = meta1.pronunciation || meta2.pronunciation || ''
  const memoryHook = meta1.memoryHook || meta2.memoryHook || ''

  return {
    lang1,
    lang2,
    text1: cleanText1,
    text2: cleanText2,
    rank,
    pronunciation,
    memoryHook
  }
}
